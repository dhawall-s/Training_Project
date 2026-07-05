// ============================================
// db.js - MongoDB Database Connection
// ============================================
// WHY: We use mongoose library to connect Node.js with MongoDB
// Mongoose makes it easy to define schemas (structure) for our data
// and provides simple functions to save, find, update, delete data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This function connects our app to MongoDB database
// WHY async: Database connection takes time, so we use async/await
const connectDB = async () => {
    try {
        // mongoose.connect() - connects to MongoDB
        // process.env.MONGODB_URI - this is the cloud database URL (for production/Vercel)
        // Defaulting to localhost for local development
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_erp';
        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // ============================================
        // AUTO-CREATE DEFAULT ADMIN ACCOUNT
        // ============================================
        // WHY: When the database is freshly created, there are no users
        // We need at least one admin to manage everything
        // This creates admin@erp.com / Admin@123 if it doesn't exist
        await createDefaultAdmin();

    } catch (error) {
        // If connection fails, show error and stop the server
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Stop the server (1 = error exit)
    }
};

// ============================================
// CREATE DEFAULT ADMIN
// ============================================
// WHY: First time setup - creates an admin account automatically
// so that the admin can login and start adding students/teachers
async function createDefaultAdmin() {
    try {
        // We require User model here (not at top) to avoid circular dependency
        const User = require('../models/User');

        // Check if admin account already exists
        const existingAdmin = await User.findOne({ email: 'admin@erp.com' });

        if (!existingAdmin) {
            // Hash the default password
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            // Create the default admin account
            const admin = new User({
                name: 'Administrator',
                email: 'admin@erp.com',
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('👤 Default Admin account created:');
            console.log('   Email: admin@erp.com');
            console.log('   Password: Admin@123');
        } else {
            console.log('👤 Admin account already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
}

// Export this function so we can use it in server.js
module.exports = connectDB;
