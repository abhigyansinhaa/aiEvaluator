import { AssessmentData } from '@/types';

// High-fidelity SVG Answer Sheet Pages matching the Figma design
const figmaAnswerSheetPage1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1250" viewBox="0 0 900 1250">
  <defs>
    <pattern id="lines" width="900" height="42" patternUnits="userSpaceOnUse">
      <line x1="0" y1="41" x2="900" y2="41" stroke="#e2e8f0" stroke-width="1.2"/>
    </pattern>
  </defs>
  
  <!-- Paper Background -->
  <rect width="900" height="1250" fill="#fcfcfc"/>
  
  <!-- Lined Pattern -->
  <rect y="90" width="900" height="1160" fill="url(#lines)"/>
  
  <!-- Left Margin (Pink line) -->
  <line x1="140" y1="0" x2="140" y2="1250" stroke="#fca5a5" stroke-width="2.2"/>
  
  <!-- Top Margin (Blue line) -->
  <line x1="0" y1="90" x2="900" y2="90" stroke="#93c5fd" stroke-width="2"/>

  <!-- Handwriting Font Styles -->
  <style>
    .ans-label { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 20px; font-weight: 700; fill: #1e293b; }
    .handwriting { font-family: 'Segoe UI', system-ui, cursive, sans-serif; font-size: 19px; fill: #1e3a8a; }
    .formula-box { stroke: #3b82f6; stroke-width: 1.8; fill: #eff6ff; rx: 6; }
    .diagram-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; fill: #0f172a; font-weight: 500; }
  </style>

  <!-- ================= ANSWER 1 ================= -->
  <text x="55" y="145" class="ans-label">Q1.</text>
  <text x="165" y="145" class="handwriting">Photosynthesis is the process used by</text>
  <text x="165" y="187" class="handwriting">green plants and some other organisms</text>
  <text x="165" y="229" class="handwriting">to convert light energy into chemical</text>
  <text x="165" y="271" class="handwriting">energy.</text>

  <!-- Chemical Equation Box -->
  <rect x="165" y="298" width="670" height="52" class="formula-box"/>
  <text x="185" y="332" font-family="'Segoe UI', monospace, sans-serif" font-size="18px" font-weight="bold" fill="#1e3a8a">
    6CO₂ + 6H₂O  ──── Light / Chlorophyll ────►  C₆H₁₂O₆ + 6O₂
  </text>

  <!-- Photosynthesis Plant Diagram -->
  <g transform="translate(420, 365)">
    <!-- Sun -->
    <circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
    <line x1="20" y1="-2" x2="20" y2="-8" stroke="#f59e0b" stroke-width="2"/>
    <line x1="20" y1="42" x2="20" y2="48" stroke="#f59e0b" stroke-width="2"/>
    <line x1="-2" y1="20" x2="-8" y2="20" stroke="#f59e0b" stroke-width="2"/>
    <line x1="42" y1="20" x2="48" y2="20" stroke="#f59e0b" stroke-width="2"/>
    <line x1="4" y1="4" x2="0" y2="0" stroke="#f59e0b" stroke-width="2"/>
    <line x1="36" y1="36" x2="40" y2="40" stroke="#f59e0b" stroke-width="2"/>
    <line x1="4" y1="36" x2="0" y2="40" stroke="#f59e0b" stroke-width="2"/>
    <line x1="36" y1="4" x2="40" y2="0" stroke="#f59e0b" stroke-width="2"/>
    <text x="50" y="25" class="diagram-text">Sunlight</text>

    <!-- Plant Stem & Leaves -->
    <path d="M 20 50 Q 20 85 20 120" stroke="#15803d" stroke-width="3.5" fill="none"/>
    <path d="M 20 75 Q -25 60 -50 72 Q -30 85 20 78" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <path d="M 20 90 Q 65 75 90 88 Q 70 100 20 93" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    
    <!-- Roots & Soil -->
    <line x1="-60" y1="120" x2="100" y2="120" stroke="#78350f" stroke-width="2" stroke-dasharray="4,3"/>
    <path d="M 20 120 Q 5 135 -10 150 M 20 120 Q 20 140 20 155 M 20 120 Q 35 135 50 150" stroke="#78350f" stroke-width="2.5" fill="none"/>
    <text x="120" y="145" class="diagram-text">Water</text>

    <!-- Gas Arrows -->
    <path d="M -130 90 L -70 90" stroke="#0284c7" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="-210" y="94" class="diagram-text">Carbon dioxide</text>
    
    <path d="M 110 90 L 165 90" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="180" y="94" class="diagram-text">Oxygen</text>
  </g>

  <!-- ================= ANSWER 2 ================= -->
  <text x="55" y="595" class="ans-label">Q2.</text>
  <text x="165" y="595" class="handwriting">The process mainly occurs in the</text>
  <text x="165" y="637" class="handwriting">chloroplast of the plant cell. It has</text>
  <text x="165" y="679" class="handwriting">two main stages:</text>
  <text x="165" y="721" class="handwriting">1. Light reaction — Captures light energy.</text>
  <text x="165" y="763" class="handwriting">2. Dark reaction — Uses energy to</text>
  <text x="165" y="805" class="handwriting">   make glucose.</text>

  <!-- ================= ANSWER 3 ================= -->
  <text x="55" y="885" class="ans-label">Q3.</text>
  <text x="165" y="885" class="handwriting">Chloroplasts contain chlorophyll (a &amp; b) and carotenoids.</text>
  <text x="165" y="927" class="handwriting">1) Thylakoids host light-dependent reactions generating ATP &amp; NADPH.</text>
  <text x="165" y="969" class="handwriting">2) Stroma hosts Calvin Cycle fixing CO₂ into carbohydrates.</text>

  <!-- ================= ANSWER 4 (Incorrect / partial attempt) ================= -->
  <text x="55" y="1050" class="ans-label">Q4.</text>
  <text x="165" y="1050" class="handwriting" style="fill: #94a3b8; text-decoration: line-through;">Blood flows from right atrium to left ventricle through mitral valve.</text>
  <text x="165" y="1092" class="handwriting" style="fill: #ef4444;">[Incomplete / Crossed Out]</text>
</svg>
`)}`;

const figmaAnswerSheetPage2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1250" viewBox="0 0 900 1250">
  <defs>
    <pattern id="lines2" width="900" height="42" patternUnits="userSpaceOnUse">
      <line x1="0" y1="41" x2="900" y2="41" stroke="#e2e8f0" stroke-width="1.2"/>
    </pattern>
  </defs>
  
  <rect width="900" height="1250" fill="#fcfcfc"/>
  <rect y="90" width="900" height="1160" fill="url(#lines2)"/>
  <line x1="140" y1="0" x2="140" y2="1250" stroke="#fca5a5" stroke-width="2.2"/>
  <line x1="0" y1="90" x2="900" y2="90" stroke="#93c5fd" stroke-width="2"/>

  <style>
    .ans-label { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; font-weight: 700; fill: #1e293b; }
    .handwriting { font-family: 'Segoe UI', system-ui, cursive, sans-serif; font-size: 19px; fill: #1e3a8a; }
  </style>

  <!-- Q5: Alveolus diagram -->
  <text x="55" y="145" class="ans-label">Q5.</text>
  <text x="165" y="145" class="handwriting">Diagram of Alveolus showing capillary network &amp; gas exchange:</text>
  <!-- Alveolus Drawing -->
  <circle cx="360" cy="250" r="60" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
  <text x="440" y="240" font-family="sans-serif" font-size="15" fill="#c2410c">Alveolar Sac</text>
  <path d="M 270 230 C 290 330 430 330 450 230" stroke="#dc2626" stroke-width="6" fill="none"/>
  <text x="470" y="300" font-family="sans-serif" font-size="15" fill="#dc2626">Capillary (O₂ / CO₂ exchange)</text>

  <!-- Q6: Digestive System -->
  <text x="55" y="440" class="ans-label">Q6.</text>
  <text x="165" y="440" class="handwriting">Digestive System: Stomach, Small Intestine, Large Intestine, Liver, Pancreas.</text>
  <text x="165" y="482" class="handwriting">Site where most absorption occurs: Small Intestine (via Villi).</text>

  <!-- Q7: Nephron -->
  <text x="55" y="650" class="ans-label">Q7.</text>
  <text x="165" y="650" class="handwriting">Nephron structure: Bowman's capsule encapsulates glomerulus,</text>
  <text x="165" y="692" class="handwriting">leading into Proximal Convoluted Tubule, Loop of Henle, Distal Tubule,</text>
  <text x="165" y="734" class="handwriting">and empty into Collecting Duct for urine filtration.</text>
</svg>
`)}`;

const figmaAnswerSheetPage3 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1250" viewBox="0 0 900 1250">
  <defs>
    <pattern id="lines3" width="900" height="42" patternUnits="userSpaceOnUse">
      <line x1="0" y1="41" x2="900" y2="41" stroke="#e2e8f0" stroke-width="1.2"/>
    </pattern>
  </defs>
  
  <rect width="900" height="1250" fill="#fcfcfc"/>
  <rect y="90" width="900" height="1160" fill="url(#lines3)"/>
  <line x1="140" y1="0" x2="140" y2="1250" stroke="#fca5a5" stroke-width="2.2"/>
  <line x1="0" y1="90" x2="900" y2="90" stroke="#93c5fd" stroke-width="2"/>

  <style>
    .ans-label { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; font-weight: 700; fill: #1e293b; }
    .handwriting { font-family: 'Segoe UI', system-ui, cursive, sans-serif; font-size: 19px; fill: #1e3a8a; }
  </style>

  <!-- Q8 -->
  <text x="55" y="145" class="ans-label">Q8.</text>
  <text x="165" y="145" class="handwriting">Palisade mesophyll: Columnar, tightly packed with maximum chloroplasts.</text>
  <text x="165" y="187" class="handwriting">Spongy mesophyll: Loosely arranged with large air cavities for gas exchange.</text>

  <!-- Q9 -->
  <text x="55" y="310" class="ans-label">Q9.</text>
  <text x="165" y="310" class="handwriting">Transpiration is the loss of water vapour from stomata in leaves.</text>
  <text x="165" y="352" class="handwriting">Environmental factors increasing rate: 1. High temperature, 2. High wind speed.</text>

  <!-- Q10 -->
  <text x="55" y="475" class="ans-label">Q10.</text>
  <text x="165" y="475" class="handwriting">Xylem vessels have hollow, lignified thick cell walls without end walls,</text>
  <text x="165" y="517" class="handwriting">forming a continuous pipe for capillary suction of water and minerals.</text>
</svg>
`)}`;

const figmaAnswerSheetPage4 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1250" viewBox="0 0 900 1250">
  <defs>
    <pattern id="lines4" width="900" height="42" patternUnits="userSpaceOnUse">
      <line x1="0" y1="41" x2="900" y2="41" stroke="#e2e8f0" stroke-width="1.2"/>
    </pattern>
  </defs>
  
  <rect width="900" height="1250" fill="#fcfcfc"/>
  <rect y="90" width="900" height="1160" fill="url(#lines4)"/>
  <line x1="140" y1="0" x2="140" y2="1250" stroke="#fca5a5" stroke-width="2.2"/>
  <line x1="0" y1="90" x2="900" y2="90" stroke="#93c5fd" stroke-width="2"/>

  <style>
    .ans-label { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; font-weight: 700; fill: #1e293b; }
    .handwriting { font-family: 'Segoe UI', system-ui, cursive, sans-serif; font-size: 19px; fill: #1e3a8a; }
  </style>

  <!-- Q11 a -->
  <text x="40" y="145" class="ans-label">Q11(a)</text>
  <text x="165" y="145" class="handwriting">Plant A received adequate sunlight for photosynthesis and chlorophyll synthesis,</text>
  <text x="165" y="187" class="handwriting">whereas Plant B experienced etiolation due to light deprivation.</text>

  <!-- Q11 b -->
  <text x="40" y="270" class="ans-label">Q11(b)</text>
  <text x="165" y="270" class="handwriting">Move Plant B to direct sunlight and provide adequate watering.</text>

  <!-- Q12 -->
  <text x="55" y="395" class="ans-label">Q12.</text>
  <text x="165" y="395" class="handwriting">Total Minute Ventilation = Tidal Volume × Respiratory Rate</text>
  <text x="165" y="437" class="handwriting">= 0.5 L × 12 breaths/min = 6.0 L/min.</text>

  <!-- Q13 -->
  <text x="55" y="560" class="ans-label">Q13.</text>
  <text x="165" y="560" class="handwriting">Alveolar Ventilation = (Tidal Volume − Dead Space) × Respiratory Rate</text>
  <text x="165" y="602" class="handwriting">= (0.50 L − 0.15 L) × 12 = 0.35 L × 12 = 4.2 L/min.</text>
</svg>
`)}`;

export const demoAssessmentData: AssessmentData = {
  questions: [
    {
      id: 'q1',
      number: '1',
      text: 'Which blood vessel carries blood away from the heart?',
      maxMarks: 2,
    },
    {
      id: 'q2',
      number: '2',
      text: 'Which of the following organelles is primarily involved in photosynthesis?',
      maxMarks: 2,
    },
    {
      id: 'q3',
      number: '3',
      text: 'Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.',
      maxMarks: 2,
    },
    {
      id: 'q4',
      number: '4',
      text: 'Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta; include the names of valves crossed.',
      maxMarks: 2,
    },
    {
      id: 'q5',
      number: '5',
      text: 'Draw a labelled diagram of an alveolus showing capillaries and air space (label alveolar sac, capillary, and direction of gas exchange).',
      maxMarks: 2,
    },
    {
      id: 'q6',
      number: '6',
      text: 'Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.',
      maxMarks: 5,
    },
    {
      id: 'q7',
      number: '7',
      text: 'Draw and label a nephron (Bowman\'s capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).',
      maxMarks: 5,
    },
    {
      id: 'q8',
      number: '8',
      text: 'Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.',
      maxMarks: 5,
    },
    {
      id: 'q9',
      number: '9',
      text: 'Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.',
      maxMarks: 5,
    },
    {
      id: 'q10',
      number: '10',
      text: 'Explain how the structure of xylem vessels facilitates water transport in plants (mention one structural feature and its role).',
      maxMarks: 5,
    },
    {
      id: 'q11_a',
      number: '11 a.',
      parentNumber: '11',
      text: 'A diagram shows two potted plants — Plant A in bright light with broad green leaves, Plant B kept in dim light with pale, elongated leaves.',
      maxMarks: 2,
    },
    {
      id: 'q11_b',
      number: '11 b.',
      parentNumber: '11',
      text: 'Suggest one practical measure to help Plant B recover.',
      maxMarks: 3,
    },
    {
      id: 'q12',
      number: '12',
      text: 'A resting person has tidal volume (air per breath) of 0.5 L and breathes 12 times per minute.',
      maxMarks: 5,
    },
    {
      id: 'q13',
      number: '13',
      text: 'If dead space is 0.15 L per breath, calculate the alveolar ventilation per minute. Show working.',
      maxMarks: 5,
    },
  ],
  answers: [
    {
      id: 'ans_1',
      detectedQuestionNumber: '1',
      text: 'Photosynthesis is the process used by green plants and some other organisms to convert light energy into chemical energy. 6CO₂ + 6H₂O ──► C₆H₁₂O₆ + 6O₂',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 90, xmin: 40, ymax: 450, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_2',
      detectedQuestionNumber: '2',
      text: 'The process mainly occurs in the chloroplast of the plant cell. It has two main stages: 1. Light reaction - Captures light energy. 2. Dark reaction - Uses energy to make glucose.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 460, xmin: 40, ymax: 680, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_3',
      detectedQuestionNumber: '3',
      text: 'Chloroplasts contain chlorophyll (a & b) and carotenoids. Thylakoids host light-dependent reactions; stroma hosts Calvin Cycle.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 700, xmin: 40, ymax: 800, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_5',
      detectedQuestionNumber: '5',
      text: 'Diagram of Alveolus showing capillary network and gas exchange.',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 90, xmin: 40, ymax: 320, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_6',
      detectedQuestionNumber: '6',
      text: 'Digestive system diagram and absorption site: Small Intestine (via Villi).',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 340, xmin: 40, ymax: 480, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_7',
      detectedQuestionNumber: '7',
      text: 'Nephron structure: Bowman\'s capsule, glomerulus, Proximal tubule, Loop of Henle, Distal Tubule, Collecting Duct.',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 500, xmin: 40, ymax: 680, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_8',
      detectedQuestionNumber: '8',
      text: 'Palisade mesophyll: Columnar, packed with chloroplasts. Spongy mesophyll: Loosely arranged with air cavities.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 90, xmin: 40, ymax: 220, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_9',
      detectedQuestionNumber: '9',
      text: 'Transpiration is the loss of water vapour from stomata. Environmental factors: High temperature and wind speed.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 240, xmin: 40, ymax: 360, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_10',
      detectedQuestionNumber: '10',
      text: 'Xylem vessels have hollow, lignified thick cell walls forming a continuous tube for capillary suction.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 370, xmin: 40, ymax: 500, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_11_a',
      detectedQuestionNumber: '11 a.',
      text: 'Plant A received adequate sunlight for photosynthesis, Plant B suffered etiolation due to light deprivation.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 90, xmin: 30, ymax: 200, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_11_b',
      detectedQuestionNumber: '11 b.',
      text: 'Move Plant B to direct sunlight and provide adequate watering.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 210, xmin: 30, ymax: 290, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_12',
      detectedQuestionNumber: '12',
      text: 'Total Minute Ventilation = Tidal Volume × Respiratory Rate = 0.5 L × 12 = 6.0 L/min.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 310, xmin: 40, ymax: 420, xmax: 960 },
        },
      ],
    },
    {
      id: 'ans_13',
      detectedQuestionNumber: '13',
      text: 'Alveolar Ventilation = (0.50 L − 0.15 L) × 12 = 4.2 L/min.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 440, xmin: 40, ymax: 550, xmax: 960 },
        },
      ],
    },
  ],
  mappings: [
    {
      questionId: 'q1',
      questionNumber: '1',
      questionText: 'Which blood vessel carries blood away from the heart?',
      maxMarks: 2,
      status: 'answered',
      answerId: 'ans_1',
      answerText: 'Arteries carry oxygenated blood away from the heart (Pulmonary artery carries deoxygenated blood to lungs).',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 90, xmin: 40, ymax: 450, xmax: 960 },
        },
      ],
      marksObtained: 2,
      isCorrect: true,
      feedback: 'Accurately identifies arteries and vessels carrying blood away from heart ventricles.',
    },
    {
      questionId: 'q2',
      questionNumber: '2',
      questionText: 'Which of the following organelles is primarily involved in photosynthesis?',
      maxMarks: 2,
      status: 'answered',
      answerId: 'ans_2',
      answerText: 'The process mainly occurs in the chloroplast of the plant cell. It has two main stages: 1. Light reaction - Captures light energy. 2. Dark reaction - Uses energy to make glucose.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 460, xmin: 40, ymax: 680, xmax: 960 },
        },
      ],
      marksObtained: 2,
      isCorrect: true,
      feedback: 'Excellent work! You correctly identified the chloroplast as the organelle responsible for photosynthesis. Keep it up!',
    },
    {
      questionId: 'q3',
      questionNumber: '3',
      questionText: 'Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.',
      maxMarks: 2,
      status: 'answered',
      answerId: 'ans_3',
      answerText: 'Chloroplasts contain chlorophyll (a & b) and carotenoids. Thylakoids host light-dependent reactions; stroma hosts Calvin Cycle.',
      regions: [
        {
          pageIndex: 0,
          box: { ymin: 700, xmin: 40, ymax: 800, xmax: 960 },
        },
      ],
      marksObtained: 2,
      isCorrect: true,
      feedback: 'Clear outline of light and dark reactions with pigments named.',
    },
    {
      questionId: 'q4',
      questionNumber: '4',
      questionText: 'Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta; include the names of valves crossed.',
      maxMarks: 2,
      status: 'unanswered',
      regions: [],
      marksObtained: 0,
      isCorrect: false,
      feedback: 'Student attempted to write response but crossed it out. Question considered unattempted.',
    },
    {
      questionId: 'q5',
      questionNumber: '5',
      questionText: 'Draw a labelled diagram of an alveolus showing capillaries and air space (label alveolar sac, capillary, and direction of gas exchange).',
      maxMarks: 2,
      status: 'answered',
      answerId: 'ans_5',
      answerText: 'Diagram of Alveolus showing capillary network and gas exchange.',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 90, xmin: 40, ymax: 320, xmax: 960 },
        },
      ],
      marksObtained: 2,
      isCorrect: true,
      feedback: 'Well labelled diagram with accurate gas diffusion arrows.',
    },
    {
      questionId: 'q6',
      questionNumber: '6',
      questionText: 'Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_6',
      answerText: 'Digestive system diagram and absorption site: Small Intestine (via Villi).',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 340, xmin: 40, ymax: 480, xmax: 960 },
        },
      ],
      marksObtained: 4,
      isCorrect: true,
      feedback: 'Good diagram; pancreas label was slightly ambiguous. Site of absorption correctly marked.',
    },
    {
      questionId: 'q7',
      questionNumber: '7',
      questionText: 'Draw and label a nephron (Bowman\'s capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_7',
      answerText: 'Nephron structure: Bowman\'s capsule, glomerulus, Proximal tubule, Loop of Henle, Distal Tubule, Collecting Duct.',
      regions: [
        {
          pageIndex: 1,
          box: { ymin: 500, xmin: 40, ymax: 680, xmax: 960 },
        },
      ],
      marksObtained: 5,
      isCorrect: true,
      feedback: 'Excellent nephron schematic with all 6 components accurately positioned.',
    },
    {
      questionId: 'q8',
      questionNumber: '8',
      questionText: 'Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_8',
      answerText: 'Palisade mesophyll: Columnar, packed with chloroplasts. Spongy mesophyll: Loosely arranged with air cavities.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 90, xmin: 40, ymax: 220, xmax: 960 },
        },
      ],
      marksObtained: 3,
      isCorrect: true,
      feedback: 'Correct structural distinction. Minor detail omitted on vascular bundle connection.',
    },
    {
      questionId: 'q9',
      questionNumber: '9',
      questionText: 'Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_9',
      answerText: 'Transpiration is the loss of water vapour from stomata. Environmental factors: High temperature and wind speed.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 240, xmin: 40, ymax: 360, xmax: 960 },
        },
      ],
      marksObtained: 5,
      isCorrect: true,
      feedback: 'Complete and concise explanation of transpiration stream and environmental influences.',
    },
    {
      questionId: 'q10',
      questionNumber: '10',
      questionText: 'Explain how the structure of xylem vessels facilitates water transport in plants (mention one structural feature and its role).',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_10',
      answerText: 'Xylem vessels have hollow, lignified thick cell walls forming a continuous tube for capillary suction.',
      regions: [
        {
          pageIndex: 2,
          box: { ymin: 370, xmin: 40, ymax: 500, xmax: 960 },
        },
      ],
      marksObtained: 4,
      isCorrect: true,
      feedback: 'Lignin and continuous hollow tube correctly identified.',
    },
    {
      questionId: 'q11_a',
      questionNumber: '11 a.',
      questionText: 'A diagram shows two potted plants — Plant A in bright light with broad green leaves, Plant B kept in dim light with pale, elongated leaves.',
      maxMarks: 2,
      status: 'answered',
      answerId: 'ans_11_a',
      answerText: 'Plant A received adequate sunlight for photosynthesis, Plant B suffered etiolation due to light deprivation.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 90, xmin: 30, ymax: 200, xmax: 960 },
        },
      ],
      marksObtained: 2,
      isCorrect: true,
      feedback: 'Correctly identifies etiolation and light dependency.',
    },
    {
      questionId: 'q11_b',
      questionNumber: '11 b.',
      questionText: 'Suggest one practical measure to help Plant B recover.',
      maxMarks: 3,
      status: 'answered',
      answerId: 'ans_11_b',
      answerText: 'Move Plant B to direct sunlight and provide adequate watering.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 210, xmin: 30, ymax: 290, xmax: 960 },
        },
      ],
      marksObtained: 1,
      isCorrect: true,
      feedback: 'Gradual acclimation is recommended over sudden direct sunlight exposure.',
    },
    {
      questionId: 'q12',
      questionNumber: '12',
      questionText: 'A resting person has tidal volume (air per breath) of 0.5 L and breathes 12 times per minute.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_12',
      answerText: 'Total Minute Ventilation = Tidal Volume × Respiratory Rate = 0.5 L × 12 = 6.0 L/min.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 310, xmin: 40, ymax: 420, xmax: 960 },
        },
      ],
      marksObtained: 4,
      isCorrect: true,
      feedback: 'Calculation is correct (6 L/min).',
    },
    {
      questionId: 'q13',
      questionNumber: '13',
      questionText: 'If dead space is 0.15 L per breath, calculate the alveolar ventilation per minute. Show working.',
      maxMarks: 5,
      status: 'answered',
      answerId: 'ans_13',
      answerText: 'Alveolar Ventilation = (0.50 L − 0.15 L) × 12 = 4.2 L/min.',
      regions: [
        {
          pageIndex: 3,
          box: { ymin: 440, xmin: 40, ymax: 550, xmax: 960 },
        },
      ],
      marksObtained: 4,
      isCorrect: true,
      feedback: 'Accurate subtraction of dead space and minute multiplication (4.2 L/min).',
    },
  ],
  unmappedAnswers: [],
  questionPageImages: [figmaAnswerSheetPage1, figmaAnswerSheetPage2, figmaAnswerSheetPage3, figmaAnswerSheetPage4],
  answerPageImages: [figmaAnswerSheetPage1, figmaAnswerSheetPage2, figmaAnswerSheetPage3, figmaAnswerSheetPage4],
  gradingSummary: {
    totalMarksObtained: 38,
    totalMaxMarks: 45,
    percentage: 84,
    answeredCount: 13,
    unansweredCount: 1,
    overallFeedback: 'Strong overall performance across physiology and botany questions! 13 out of 14 items answered with high accuracy.',
  },
};
