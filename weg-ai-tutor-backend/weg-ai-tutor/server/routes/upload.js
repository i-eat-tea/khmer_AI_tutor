const express = require('express');
const router = express.Router();

// POST /api/upload
// Teacher-only route. Accepts curriculum/answer-sheet material to ground
// the AI's explanations. body: { teacherId, classId, title, content }
router.post('/', async (req, res) => {
  try {
    const { teacherId, classId, title, content } = req.body;

    if (!teacherId || !classId || !content) {
      return res.status(400).json({ error: 'teacherId, classId, and content are required.' });
    }

    // TODO: verify teacherId has permission for classId, then insert into
    // curriculum_docs table. See /database/schema.sql.

    res.json({ status: 'received', title });
  } catch (err) {
    console.error('Error in /api/upload:', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

module.exports = router;
