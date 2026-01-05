const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const process = require('process');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://zaf:Ineed180@zaf-db.205m7bj.mongodb.net/zaf-db?retryWrites=true&w=majority";

// Schema matching your AdminPortalLogin.js (keeps compatibility if model changes)
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { 
        type: String, 
        enum: ['Super Admin', 'Manager', 'Moderator', 'Support Staff', 'Policy Lead', 'Content Editor'],
        default: 'Moderator'
    },
    password: { type: String, required: true }
}, { timestamps: true });

const AdminPortalLogin = mongoose.model('AdminPortalLogin', adminSchema);

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        const argv = process.argv.slice(2);
        const email = argv[0] || process.env.SEED_ADMIN_EMAIL || "admin@fazreg.online";
        const password = argv[1] || process.env.SEED_ADMIN_PASSWORD || "AdminPassword123!";
        const name = argv[2] || process.env.SEED_ADMIN_NAME || "Super Administrator";
        const role = argv[3] || process.env.SEED_ADMIN_ROLE || "Super Admin";
        const force = argv.includes('--force') || process.env.SEED_ADMIN_FORCE === '1';

        if (!email || !password) {
            console.error('Usage: node seed-admin.cjs <email> <password> [name] [role] [--force]');
            process.exit(1);
        }

        const existing = await AdminPortalLogin.findOne({ email });
        if (existing) {
            console.log('An admin with this email already exists:', email);
            if (!force) {
                console.log('Use --force to update the password. Exiting.');
                process.exit(0);
            }
            const salt = await bcrypt.genSalt(10);
            existing.password = await bcrypt.hash(password, salt);
            existing.name = name;
            existing.role = role;
            await existing.save();
            console.log('Admin updated (password reset).');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new AdminPortalLogin({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newAdmin.save();
        console.log('--- ADMIN CREATED SUCCESSFULLY ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------------');

    } catch (err) {
        console.error('Error:', err.message || err);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
}

run();
