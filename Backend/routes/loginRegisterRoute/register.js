const Admin = require('../../models/Admin');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = new Admin({
            username: username,
            password: hashedPassword
        });

        await newAdmin.save();

        console.log('New admin registered:', newAdmin);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { handleRegister };
