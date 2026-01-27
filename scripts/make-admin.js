
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function makeAdmin(email) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: email });

        if (!user) {
            console.log(`User with email ${email} not found!`);
            // Create a default admin user if not exists
            // But we need password hash logic here which is complex for a simple script without importing app code
            // So we just exit
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`Successfully updated user ${email} to admin role.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email address.');
    console.log('Usage: node scripts/make-admin.js <email>');
    process.exit(1);
}

makeAdmin(email);
