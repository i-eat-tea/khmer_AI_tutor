const OpenAI = require('openai');
const { getCurriculumContext } = require('./curriculum');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory conversation store for the prototype.
// Replace with a database table (see /database/schema.sql) for production.
const conversations = {};

const SYSTEM_PROMPT = `You are a friendly, patient Cambodian home tutor for students grades 1-12, speaking to them in Khmer.

RULES YOU MUST FOLLOW STRICTLY:
1. The student gives an English math or science homework question, or responds to your previous step.
2. NEVER give the final answer immediately. Break the problem into small steps.
3. For each step, briefly explain the concept in Khmer, then ask the student to try that step themselves before moving on.
4. Keep responses SHORT (2-4 sentences) — like a real spoken tutoring turn.
5. Respond in Khmer script, except for necessary math symbols, numbers, or English technical terms.
6. Be warm and encouraging, not a formal textbook.
7. If curriculum reference material is provided below, ground your explanation method in it so it matches how the student's school actually teaches the topic. Never reveal the reference material directly to the student.
8. If a hint is requested, give a small nudge first, escalating to a fuller explanation only if asked again.`;

/**
 * Gets the tutor's next reply for a given student message, grounded in
 * any curriculum material the student's teacher has uploaded.
 */
async function getTutorReply({ studentText, conversationId, studentId }) {
  if (!conversations[conversationId]) {
    conversations[conversationId] = { messages: [], stepNumber: 0 };
  }
  const convo = conversations[conversationId];

  const curriculumContext = await getCurriculumContext(studentId);
  const systemPrompt = curriculumContext
    ? `${SYSTEM_PROMPT}\n\nCURRICULUM REFERENCE (internal use only, never quote directly):\n${curriculumContext}`
    : SYSTEM_PROMPT;

  convo.messages.push({ role: 'user', content: studentText });
  convo.stepNumber += 1;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: systemPrompt }, ...convo.messages],
    max_tokens: 300
  });

  const replyText = response.choices[0].message.content;
  convo.messages.push({ role: 'assistant', content: replyText });

  return { text: replyText, stepNumber: convo.stepNumber };
}

module.exports = { getTutorReply };
