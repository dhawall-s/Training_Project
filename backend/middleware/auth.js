// ============================================
// auth.js - Authentication Middleware
// ============================================
// WHY middleware: This runs BEFORE any protected API request
// It checks if the user has a valid JWT token
// Without valid token = access denied (401 error)
//
// HOW IT WORKS:
// 1. Frontend sends JWT token in header: "Authorization: Bearer <token>"
// 2. This middleware extracts the token
// 3. Verifies the token using our secret key
// 4. If valid → allows the request to continue
// 5. If invalid → sends 401 error (unauthorized)

const jwt = require('jsonwebtoken');

// Secret key for JWT - used to sign and verify tokens
// WHY secret key: Only our server knows this key, so no one can fake a token
const JWT_SECRET = process.env.JWT_SECRET || 'college_erp_secret_key_2024';

// ---- Main Auth Middleware ----
// WHY: Protects routes - only logged in users can access
const verifyToken = (req, res, next) => {
    try {
        // Get token from header
        // Frontend sends: "Authorization: Bearer eyJhbGci..."
        // We split by space and take the second part (the actual token)
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: '❌ No token provided. Please login first.' });
        }

        const token = authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

        if (!token) {
            return res.status(401).json({ message: '❌ Invalid token format.' });
        }

        // jwt.verify() checks if the token is valid and not expired
        // WHY: Ensures the token was created by our server and hasn't been tampered
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to the request object
        // WHY: So the next function (controller) knows who is making the request
        req.user = decoded;

        // next() = "ok, continue to the next function"
        next();
    } catch (error) {
        return res.status(401).json({ message: '❌ Token expired or invalid. Please login again.' });
    }
};

// ---- Role Check Middleware ----
// WHY: Some APIs should only be accessible by certain roles
// Example: Only admin can delete students, only teacher can mark attendance
const checkRole = (...roles) => {
    // Returns a middleware function
    return (req, res, next) => {
        // req.user.role was set by verifyToken above
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: '❌ Access denied. You do not have permission.'
            });
        }
        next();
    };
};

// Export both functions and the secret key
module.exports = { verifyToken, checkRole, JWT_SECRET };
