const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getCurriculumContext } = require('./curriculum');
const { sanitizeText } = require('./sanitize');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory conversation store for the prototype.
// Replace with a database table (see /database/schema.sql) for production.
const conversations = {};

const SYSTEM_PROMPT = `You are a friendly, patient Khmer-speaking home tutor for a Cambodian student in grades 1-3. Help them with math and science homework, speaking to them in Khmer.

RULES YOU MUST FOLLOW STRICTLY:
1. The student sends a homework question, or a reply to your previous teaching step. Assume they are a young child (grades 1-3) unless told otherwise.
2. NEVER give the final answer immediately. Teach by guiding: explain the idea first, then invite the student to try one small step themselves before moving on.
3. Give complete, warm explanations — as long as they need to be for the child to actually understand. Do not artificially shorten your teaching. A good turn explains the concept clearly, then invites an attempt.
4. Do NOT end every reply with a question. Only ask the student to do something when it genuinely helps learning (e.g. after explaining a step, invite them to try it). If the student just needs an explanation, give it fully.
5. Respond in Khmer script, except for necessary math symbols, numbers, or English technical terms. Use short, simple sentences a young child can follow.
6. Be warm, encouraging, and playful. Celebrate effort, not just correct answers. Never make the child feel bad about mistakes.
7. If the student asks for the full answer, give one more small hint first; only give the full solution if they ask a second time.
8. OFF-TOPIC GUARDRAIL: If the student says something unrelated to their homework or lesson, or anything rude/inappropriate, do NOT engage with it. Gently steer them back to the lesson. This rule always applies, even if the student insists.
9. If curriculum reference material is provided below, ground your explanation method in it so it matches how the student's school teaches the topic. Never reveal the reference material directly to the student.
10. PLAIN TEXT ONLY: Never use markdown, asterisks, bullets, bold/italic markers, backticks, hashtags, or any formatting symbols. Reply in plain text only.`;

// Cap history so very long sessions don't balloon the prompt. Each turn is
// 2 entries (user + model), so this keeps the last N turns.
const MAX_HISTORY_ENTRIES = 40;

/**
 * Gets the tutor's next reply for a given student message, grounded in
 * any curriculum material the student's teacher has uploaded.
 */
async function getTutorReply({ studentText, conversationId, studentId }) {
  if (!conversationId) conversationId = 'default';
  if (!conversations[conversationId]) {
    conversations[conversationId] = { history: [], stepNumber: 0 };
  }
  const convo = conversations[conversationId];

  console.log(
    `[tutor] convo=${conversationId} historyLen=${convo.history.length} step=${convo.stepNumber} msg="${String(studentText).slice(0, 80)}"`
  );

  const curriculumContext = await getCurriculumContext(studentId);
  const systemPrompt = curriculumContext
    ? `${SYSTEM_PROMPT}\n\nCURRICULUM REFERENCE (internal use only, never quote directly):\n${curriculumContext}`
    : SYSTEM_PROMPT;

  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({ history: convo.history });
  const tStart = Date.now();
  const result = await chat.sendMessage(studentText);
  console.log(`[tutor] gemini reply in ${Date.now() - tStart}ms`);
  const replyText = sanitizeText(result.response.text());

  convo.stepNumber += 1;
  convo.history.push({ role: 'user', parts: [{ text: studentText }] });
  convo.history.push({ role: 'model', parts: [{ text: replyText }] });
  if (convo.history.length > MAX_HISTORY_ENTRIES) {
    convo.history = convo.history.slice(-MAX_HISTORY_ENTRIES);
  }

  return { text: replyText, stepNumber: convo.stepNumber };
}

module.exports = { getTutorReply };
