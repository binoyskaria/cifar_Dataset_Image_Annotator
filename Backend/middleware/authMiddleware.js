


const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    // Logging request headers for debug purposes
    console.log('Request headers:', req.headers);

    const authorizationHeader = req.headers.authorization;
    console.log('Authorization Header:', authorizationHeader);

    // Validate presence of Authorization header
    if (!authorizationHeader) {
        console.error('Authorization header missing');
        return res.status(401).json({ error: 'Unauthorized: No Authorization header provided' });
    }

    try {
        const token = authorizationHeader.split(' ')[1];
        console.log('Token:', token);

        // Decoding the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);

        // Assuming 'role' is a property of the token's payload
        const userRole = decoded;
        console.log('Decoded User Role:', userRole);

        // Checking if the user is an admin
        if (userRole === 'admin') {
            console.log('User is an admin. Access granted.');
            next();
        } else {
            console.error('User does not have admin access.');
            res.status(403).json({ error: 'Access forbidden: User is not an admin' });
        }
    } catch (error) {
        console.error('Error decoding token:', error);

        // Handle specific JWT errors and generic errors
        if (error.name === 'JsonWebTokenError') {
            res.status(400).json({ error: 'Invalid Token' });
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token Expired' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = { isAdmin };
