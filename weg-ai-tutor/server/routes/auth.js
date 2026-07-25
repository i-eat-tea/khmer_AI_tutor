const express = require('express');
const router = express.Router();

// POST /api/auth/login
// body: { email, password }
// Returns a role (student | teacher) and a token for subsequent requests.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    // TODO: look up user in the users table, verify password hash (bcrypt),
    // and issue a JWT. Placeholder response below.
    res.json({
      token: 'placeholder-jwt-token',
      role: 'student', // or 'teacher'
      userId: 'stu_001'
    });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
