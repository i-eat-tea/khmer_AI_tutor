const express = require('express');
const router = express.Router();

// GET /api/dashboard?teacherId=...
// Returns a summary of how each student in the teacher's class is using
// the tutor: number of questions asked, hints requested per question,
// and whether they tend to attempt steps or skip to full explanations.
router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required.' });
    }

    // TODO: replace with a real query against questions_log, grouped by student.
    // Placeholder shape shown below so the frontend can be built against it now.
    const sampleData = [
      { studentId: 'stu_001', studentName: 'Sample Student A', questionsThisWeek: 12, avgHintsPerQuestion: 1.4, fullExplanationRate: 0.2 },
      { studentId: 'stu_002', studentName: 'Sample Student B', questionsThisWeek: 5, avgHintsPerQuestion: 2.8, fullExplanationRate: 0.6 }
    ];

    res.json({ students: sampleData });
  } catch (err) {
    console.error('Error in /api/dashboard:', err);
    res.status(500).json({ error: 'Could not load dashboard.' });
  }
});

module.exports = router;
