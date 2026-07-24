// Looks up any curriculum/answer-sheet material a teacher has uploaded
// for a given student's class, to ground the AI's explanations in what
// the school actually teaches. This content is NEVER sent to the student
// directly — it is only injected into the system prompt as internal context.

/**
 * @param {string} studentId
 * @returns {Promise<string|null>} relevant curriculum text, or null if none uploaded
 */
async function getCurriculumContext(studentId) {
  // TODO: replace with a real DB lookup against curriculum_docs,
  // joined on the student's class/grade. See /database/schema.sql.
  //
  // Example:
  // const doc = await db.query(
  //   'SELECT content FROM curriculum_docs WHERE class_id = (SELECT class_id FROM users WHERE id = ?) LIMIT 1',
  //   [studentId]
  // );
  // return doc ? doc.content : null;

  return null; // no curriculum uploaded yet in the prototype
}

module.exports = { getCurriculumContext };
