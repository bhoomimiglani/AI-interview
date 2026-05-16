import Groq from 'groq-sdk';
import fs from 'fs';
import { IAnswerFeedback } from '../models/Interview.model';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder',
});

export const getAIFeedback = async (
  question: string,
  answer: string,
  expectedKeyPoints: string[],
  questionType: string
): Promise<IAnswerFeedback> => {
  try {
    const prompt = `You are a STRICT and HONEST technical interviewer. Your job is to give ACCURATE scores — do NOT give high scores for vague, incomplete, or wrong answers.

Question: "${question}"
Question Type: ${questionType}
Expected Key Points that MUST be covered: ${expectedKeyPoints.join(', ')}

Candidate's Answer: "${answer}"

SCORING RULES (be strict):
- If the answer is blank, random, or completely off-topic → score 0-10
- If the answer is very vague with no specifics → score 10-30
- If the answer partially covers some key points → score 30-55
- If the answer covers most key points with some depth → score 55-75
- If the answer is thorough, specific, and covers all key points → score 75-90
- Only give 90+ for truly exceptional, detailed, well-structured answers
- communicationScore: how clearly and structured the answer is expressed
- technicalScore: how technically accurate and deep the answer is (0 if wrong/missing)
- confidenceScore: how assertive and certain the answer sounds

Check each expected key point — if it is NOT mentioned in the answer, it goes in keyPointsMissed and lowers the score significantly.

Return ONLY valid JSON, no markdown, no extra text:
{
  "score": <0-100>,
  "communicationScore": <0-100>,
  "technicalScore": <0-100>,
  "confidenceScore": <0-100>,
  "strengths": ["only real strengths, empty array if none"],
  "improvements": ["specific things missing or wrong"],
  "detailedFeedback": "honest 2-3 sentence assessment mentioning what was missing",
  "keyPointsCovered": ["only points actually mentioned in the answer"],
  "keyPointsMissed": ["points from expected list NOT covered in the answer"]
}`;

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a strict, honest technical interviewer. Never inflate scores. A vague or incomplete answer should score low. Only reward answers that genuinely cover the expected key points with accuracy and depth. Always respond with valid JSON only, no markdown, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from Groq');

    // Strip markdown code blocks if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const feedback = JSON.parse(cleaned) as IAnswerFeedback;
    return feedback;
  } catch (error) {
    console.error('Groq feedback error:', error);
    // Return default feedback if AI fails
    return {
      isCorrect: false,
      selectedOptionIndex: -1,
      correctOptionIndex: -1,
      explanation: 'AI feedback temporarily unavailable.',
      score: 0,
    };
  }
};

export const transcribeAudio = async (audioFilePath: string): Promise<string> => {
  try {
    const audioStream = fs.createReadStream(audioFilePath) as any;

    const transcription = await groq.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-large-v3',
      language: 'en',
      response_format: 'json',
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};
