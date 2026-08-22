import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();
        
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@dayflow.com' });
        if (!adminExists) {
            await User.create({
                employeeId: 'ADM001',
                name: 'System Admin',
                email: 'admin@dayflow.com',
                password: 'admin123',
                role: 'admin',
            });
            console.log('Admin user created.');
        }

        const empExists = await User.findOne({ email: 'rahul@company.com' });
        if (!empExists) {
            await User.create({
                employeeId: 'EMP001',
                name: 'Rahul Sharma',
                email: 'rahul@company.com',
                password: 'password123',
                role: 'employee',
            });
            console.log('Employee user created.');
        }

        console.log('Seeding complete.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();
