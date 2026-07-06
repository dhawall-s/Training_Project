const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'college_erp_secret_key_2024';

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: ' No token provided. Please login first.' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: ' Invalid token format.' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: ' Token expired or invalid. Please login again.' });
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: ' Access denied. You do not have permission.'
            });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole, JWT_SECRET };
