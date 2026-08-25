import { AssessmentData } from '@/types';

// Sample page image - SVG rendered as base64 for demo answer sheet
const sampleAnswerSheetPage1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
  <rect width="800" height="1100" fill="#ffffff"/>
  <!-- Sheet Margin Lines -->
  <line x1="100" y1="0" x2="100" y2="1100" stroke="#fca5a5" stroke-width="2"/>
  <line x1="0" y1="120" x2="800" y2="120" stroke="#93c5fd" stroke-width="1.5"/>
  <line x1="0" y1="160" x2="800" y2="160" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="200" x2="800" y2="200" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="240" x2="800" y2="240" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="280" x2="800" y2="280" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="320" x2="800" y2="320" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="360" x2="800" y2="360" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="400" x2="800" y2="400" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="440" x2="800" y2="440" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="520" x2="800" y2="520" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="560" x2="800" y2="560" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="600" x2="800" y2="600" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="640" x2="800" y2="640" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="680" x2="800" y2="680" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="720" x2="800" y2="720" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="760" x2="800" y2="760" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="800" x2="800" y2="800" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="840" x2="800" y2="840" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="880" x2="800" y2="880" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="920" x2="800" y2="920" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="0" y1="960" x2="800" y2="960" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- Header Text -->
  <text x="300" y="70" font-family="'Caveat', cursive, sans-serif" font-size="28" font-weight="bold" fill="#1e3a8a">Mid-Term Physics &amp; Chemistry Exam</text>
  <text x="120" y="105" font-family="'Caveat', cursive, sans-serif" font-size="20" fill="#475569">Student: Rahul Sharma | Roll No: 1042</text>

  <!-- Answer 1 Content -->
  <text x="40" y="150" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b">Ans 1.</text>
  <text x="120" y="150" font-family="sans-serif" font-size="17" fill="#1e3a8a">Newton's Second Law states that force is directly proportional</text>
  <text x="120" y="185" font-family="sans-serif" font-size="17" fill="#1e3a8a">to the rate of change of momentum of a body.</text>
  <text x="120" y="225" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">Formula:  F = m × a</text>
  <text x="120" y="260" font-family="sans-serif" font-size="16" fill="#475569">where F = force, m = mass, and a = acceleration.</text>

  <!-- Answer 11 (a) Content -->
  <text x="30" y="340" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b">Ans 11(a)</text>
  <text x="120" y="340" font-family="sans-serif" font-size="17" fill="#1e3a8a">Photosynthesis equation:</text>
  <text x="120" y="380" font-family="sans-serif" font-size="18" font-weight="bold" fill="#15803d">6CO₂ + 6H₂O  ──(light + chlorophyll)──►  C₆H₁₂O₆ + 6O₂</text>

  <!-- Answer 11 (b) Content -->
  <text x="30" y="460" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b">Ans 11(b)</text>
  <text x="120" y="460" font-family="sans-serif" font-size="17" fill="#1e3a8a">Light-dependent reactions occur in the thylakoid membranes of chloroplasts,</text>
  <text x="120" y="495" font-family="sans-serif" font-size="17" fill="#1e3a8a">where solar energy is converted into chemical energy (ATP &amp; NADPH).</text>

  <!-- Answer 3 (Out of order) -->
  <text x="40" y="580" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b">Ans 3.</text>
  <text x="120" y="580" font-family="sans-serif" font-size="17" fill="#1e3a8a">Ohm's Law: Current flowing through a conductor is directly proportional</text>
  <text x="120" y="615" font-family="sans-serif" font-size="17" fill="#1e3a8a">to potential difference applied across its ends, provided temperature remains constant.</text>
  <text x="120" y="655" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">V = I × R</text>
  
  <!-- Answer 4 (Unlabelled extra answer) -->
  <text x="35" y="740" font-family="sans-serif" font-size="18" font-weight="bold" fill="#991b1b">[Rough Notes]</text>
  <text x="120" y="740" font-family="sans-serif" font-size="16" stroke="#94a3b8" fill="#64748b">Kinetic Energy formula: KE = ½ mv²</text>
  <text x="120" y="775" font-family="sans-serif" font-size="16" fill="#64748b">Potential Energy: PE = mgh</text>
</svg>
`)}`;

export const demoAssessmentData: AssessmentData = {
  questions: [
    {
      id: 'q1',
      number: '1',
      text: 'State Newton\'s Second Law of Motion and write its mathematical expression.',
      maxMarks: 5,
    },
    {
      id: 'q2',
      number: '2',
      text: 'Explain the principle of conservation of momentum with a real-life example.',
      maxMarks: 5,
    },
    {
      id: 'q3',
      number: '3',
      text: 'Define Ohm\'s Law. State the condition under which it holds true.',
      maxMarks: 4,
    },
    {
      id: 'q11_a',
      number: '11 (a)',
      parentNumber: '11',
      text: 'Write the chemical equation for photosynthesis.',
      maxMarks: 3,
    },
    {
      id: 'q11_b',
      number: '11 (b)',
      parentNumber: '11',
      text: 'Describe where light-dependent reactions take place inside plant cells.',
      maxMarks: 3,
    },
  ],
  answers: [
    {
      id: 'ans_1',
      detectedQuestionNumber: '1',
      text: 'Newton\'s Second Law states that force is directly proportional to the rate of change of momentum of a body. Formula: F = m × a where F = force, m = mass, and a = acceleration.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 120, xmin: 30, ymax: 280, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_11_a',
      detectedQuestionNumber: '11(a)',
      text: 'Photosynthesis equation: 6CO₂ + 6H₂O ──(light + chlorophyll)──► C₆H₁₂O₆ + 6O₂',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 310, xmin: 20, ymax: 410, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_11_b',
      detectedQuestionNumber: '11(b)',
      text: 'Light-dependent reactions occur in the thylakoid membranes of chloroplasts, where solar energy is converted into chemical energy (ATP & NADPH).',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 430, xmin: 20, ymax: 520, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_3',
      detectedQuestionNumber: '3',
      text: 'Ohm\'s Law: Current flowing through a conductor is directly proportional to potential difference applied across its ends, provided temperature remains constant. V = I × R.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 550, xmin: 30, ymax: 680, xmax: 960 },
        },
      ],
    },
  ],
  mappings: [
    {
      questionId: 'q1',
      questionNumber: '1',
      questionText: 'State Newton\'s Second Law of Motion and write its mathematical expression.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_1',
      answerText: 'Newton\'s Second Law states that force is directly proportional to the rate of change of momentum of a body. Formula: F = m × a where F = force, m = mass, and a = acceleration.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 120, xmin: 30, ymax: 280, xmax: 960 },
        },
      ],
      marksObtained: 5,
      isCorrect: true,
      feedback: 'Complete and accurate definition with formula.',
    },
    {
      questionId: 'q2',
      questionNumber: '2',
      questionText: 'Explain the principle of conservation of momentum with a real-life example.',
      maxMarks: 5,
      status: 'unanswered',
      regions: [],
      marksObtained: 0,
      isCorrect: false,
      feedback: 'Question left unanswered by the student.',
    },
    {
      questionId: 'q3',
      questionNumber: '3',
      questionText: 'Define Ohm\'s Law. State the condition under which it holds true.',
      maxMarks: 4,
      status: 'answered',
      answerId: 'ans_3',
      answerText: 'Ohm\'s Law: Current flowing through a conductor is directly proportional to potential difference applied across its ends, provided temperature remains constant. V = I × R.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 550, xmin: 30, ymax: 680, xmax: 960 },
        },
      ],
      marksObtained: 4,
      isCorrect: true,
      feedback: 'Correct statement of Ohm\'s law and constant temperature condition.',
    },
    {
      questionId: 'q11_a',
      questionNumber: '11 (a)',
      questionText: 'Write the chemical equation for photosynthesis.',
      maxMarks: 3,
      status: 'answered',
      answerId: 'ans_11_a',
      answerText: 'Photosynthesis equation: 6CO₂ + 6H₂O ──(light + chlorophyll)──► C₆H₁₂O₆ + 6O₂',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 310, xmin: 20, ymax: 410, xmax: 960 },
        },
      ],
      marksObtained: 3,
      isCorrect: true,
      feedback: 'Balanced chemical equation provided correctly.',
    },
    {
      questionId: 'q11_b',
      questionNumber: '11 (b)',
      questionText: 'Describe where light-dependent reactions take place inside plant cells.',
      maxMarks: 3,
      status: 'answered',
      answerId: 'ans_11_b',
      answerText: 'Light-dependent reactions occur in the thylakoid membranes of chloroplasts, where solar energy is converted into chemical energy (ATP & NADPH).',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 430, xmin: 20, ymax: 520, xmax: 960 },
        },
      ],
      marksObtained: 3,
      isCorrect: true,
      feedback: 'Accurately specifies thylakoid membranes in chloroplasts.',
    },
  ],
  unmappedAnswers: [
    {
      id: 'ans_extra_1',
      detectedQuestionNumber: null,
      text: 'Rough Notes: Kinetic Energy formula: KE = ½ mv², Potential Energy: PE = mgh',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 720, xmin: 30, ymax: 800, xmax: 960 },
        },
      ],
      note: 'Handwritten rough notes not corresponding to any printed question.',
    },
  ],
  questionPageImages: [sampleAnswerSheetPage1],
  answerPageImages: [sampleAnswerSheetPage1],
  gradingSummary: {
    totalMarksObtained: 15,
    totalMaxMarks: 20,
    percentage: 75,
    answeredCount: 4,
    unansweredCount: 1,
    overallFeedback: 'Good overall performance! 4 out of 5 questions answered correctly. Question 2 on conservation of momentum was omitted.',
  },
};
