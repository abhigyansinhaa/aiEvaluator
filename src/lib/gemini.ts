import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, AssessmentData, QuestionAnswerMapping, UnmappedAnswer } from '@/types';
import { demoAssessmentData } from './demo-data';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Falling back to structured demo data.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

function parseInlineData(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,/);
  const mimeType = match ? match[1] : 'image/png';
  const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

/**
 * Extracts questions from question paper images using Gemini 2.0 Flash
 */
export async function processQuestionPaper(pageImages: string[]): Promise<Question[]> {
  const ai = getGeminiClient();
  if (!ai) return demoAssessmentData.questions;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const imageParts = pageImages.map(img => parseInlineData(img));

    const prompt = `
You are an expert AI assessment analyzer. Analyze the provided question paper image(s) and extract every single question.

CRITICAL INSTRUCTIONS:
1. Extract every question in the exact printed order.
2. Preserve original question numbering (e.g. "1", "2", "11 (a)", "11 (b)").
3. Treat sub-parts as SEPARATE questions (e.g., "11 (a)" and "11 (b)" must be two separate JSON entries).
4. If a question has max marks specified (e.g. [5 Marks] or (3)), extract the integer value for maxMarks.

Return ONLY a valid JSON object matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "number": "1",
      "text": "Question text here...",
      "maxMarks": 5
    },
    {
      "id": "q11_a",
      "number": "11 (a)",
      "parentNumber": "11",
      "text": "Subpart question text...",
      "maxMarks": 3
    }
  ]
}
`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean JSON markdown codeblocks if present
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return parsed.questions || demoAssessmentData.questions;
  } catch (error) {
    console.error('Error extracting questions via Gemini:', error);
    return demoAssessmentData.questions;
  }
}

/**
 * Extracts answers, maps them to questions, grades, and returns bounding regions
 */
export async function processAnswerSheetAndMap(
  questionPageImages: string[],
  answerPageImages: string[],
  extractedQuestions: Question[]
): Promise<AssessmentData> {
  const ai = getGeminiClient();
  if (!ai) return demoAssessmentData;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const answerImageParts = answerPageImages.map(img => parseInlineData(img));

    const prompt = `
You are an expert AI assessment grader and handwriting recognition engine.
You are given a list of extracted questions from an exam paper:
${JSON.stringify(extractedQuestions, null, 2)}

And you are provided with student handwritten answer sheet page image(s).

YOUR TASKS:
1. Examine the answer sheet image(s).
2. For EVERY question in the list, check if the student answered it anywhere on the answer sheet (even if answered out of order!).
3. If answered:
   - Extract the transcribed text of the answer.
   - Locate the exact bounding box region on the answer sheet where this answer appears. Bounding box coordinates must be normalized [ymin, xmin, ymax, xmax] on a scale of 0 to 1000.
   - Grade the answer (marksObtained out of maxMarks, isCorrect boolean, and feedback).
   - Set status to "answered".
4. If NOT answered:
   - Set status to "unanswered", regions to empty array, marksObtained: 0.
5. Identify any extra handwritten notes/answers that do NOT correspond to any listed question and include them in "unmappedAnswers".

Return ONLY a valid JSON object matching this schema:
{
  "mappings": [
    {
      "questionId": "q1",
      "questionNumber": "1",
      "questionText": "Question text...",
      "maxMarks": 5,
      "status": "answered",
      "answerId": "ans_1",
      "answerText": "Transcribed student answer...",
      "regions": [
        {
          "pageIndex": 0,
          "box": { "ymin": 120, "xmin": 30, "ymax": 280, "xmax": 960 }
        }
      ],
      "marksObtained": 5,
      "isCorrect": true,
      "feedback": "Great answer!"
    }
  ],
  "unmappedAnswers": [
    {
      "id": "extra_1",
      "text": "Rough notes text...",
      "regions": [
        { "pageIndex": 0, "box": { "ymin": 720, "xmin": 30, "ymax": 800, "xmax": 960 } }
      ]
    }
  ],
  "overallFeedback": "Summary of student's overall performance"
}
`;

    const result = await model.generateContent([prompt, ...answerImageParts]);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const mappings: QuestionAnswerMapping[] = parsed.mappings || demoAssessmentData.mappings;
    const unmappedAnswers: UnmappedAnswer[] = parsed.unmappedAnswers || [];

    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    let answeredCount = 0;
    let unansweredCount = 0;

    mappings.forEach(m => {
      totalMaxMarks += m.maxMarks || 0;
      totalMarksObtained += m.marksObtained || 0;
      if (m.status === 'answered') answeredCount++;
      else unansweredCount++;
    });

    const percentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100) : 0;

    return {
      questions: extractedQuestions,
      answers: mappings.filter(m => m.answerText).map(m => ({
        id: m.answerId || `ans_${m.questionId}`,
        detectedQuestionNumber: m.questionNumber,
        text: m.answerText!,
        regions: m.regions,
      })),
      mappings,
      unmappedAnswers,
      questionPageImages,
      answerPageImages,
      gradingSummary: {
        totalMarksObtained,
        totalMaxMarks,
        percentage,
        answeredCount,
        unansweredCount,
        overallFeedback: parsed.overallFeedback || 'Assessment evaluated successfully.',
      },
    };
  } catch (error) {
    console.error('Error processing answer sheet via Gemini:', error);
    return demoAssessmentData;
  }
}
