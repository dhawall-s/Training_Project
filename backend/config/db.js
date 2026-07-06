const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_erp';
        const conn = await mongoose.connect(mongoURI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
        await createDefaultAdmin();
    } catch (error) {
        console.error(` MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

async function createDefaultAdmin() {
    try {
        const User = require('../models/User');
        const existingAdmin = await User.findOne({ email: 'admin@erp.com' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            const admin = new User({
                name: 'Administrator',
                email: 'admin@erp.com',
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log(' Default Admin account created:');
            console.log('   Email: admin@erp.com');
            console.log('   Password: Admin@123');
        } else {
            console.log(' Admin account already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
}

module.exports = connectDB;
