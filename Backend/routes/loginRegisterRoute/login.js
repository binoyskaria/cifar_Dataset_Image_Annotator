




  const Admin = require('../../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  try {
    // 1. Validate request body
    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    // 2. Retrieve Admin from database by username
    const admin = await Admin.findOne({ username: req.body.username });

    // 3. Check if Admin exists and passwords match
    if (!admin || !bcrypt.compareSync(req.body.password, admin.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 4. Generate JWT token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ error: 'Missing JWT secret key' });
    }

    const token = jwt.sign("admin", secretKey);

    // 5. Send successful response with token
    return res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {handleLogin};
