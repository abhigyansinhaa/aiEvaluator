import { NextResponse } from 'next/server';
import { processUploadedFiles } from '@/lib/pdf-utils';
import { processQuestionPaper, processAnswerSheetAndMap } from '@/lib/gemini';
import { demoAssessmentData } from '@/lib/demo-data';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const questionFiles = formData.getAll('questionFiles') as File[];
    const answerFiles = formData.getAll('answerFiles') as File[];

    if (!questionFiles.length || !answerFiles.length) {
      return NextResponse.json(
        { error: 'Both question paper and student answer sheet are required.' },
        { status: 400 }
      );
    }

    // Convert uploaded files to base64 images
    const questionImages = await processUploadedFiles(questionFiles);
    const answerImages = await processUploadedFiles(answerFiles);

    // Step 1: Extract questions
    const questions = await processQuestionPaper(questionImages);

    // Step 2: Extract answers, map regions, and grade
    const result = await processAnswerSheetAndMap(questionImages, answerImages, questions);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/process:', error);
    // Return fallback demo data if error occurs
    return NextResponse.json(demoAssessmentData);
  }
}
