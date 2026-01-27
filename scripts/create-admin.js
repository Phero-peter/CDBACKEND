const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    const name = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];

    if (!name || !email || !password) {
        console.log('Usage: node scripts/create-admin.js <name> <email> <password>');
        console.log('Example: node scripts/create-admin.js "Admin User" admin@example.com admin123');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            // Update to admin
            existingUser.role = 'admin';
            await existingUser.save();
            console.log(`User ${email} already exists. Updated role to admin.`);
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await User.create({
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log(`\n✅ Admin account created successfully!`);
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            console.log(`\n📌 Login at: http://localhost:3000/auth/signin`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin();
