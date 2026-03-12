import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/ritik/Desktop/HireSnap/backend/.env' });

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!pass) {
    console.log("❌ ERROR: EMAIL_PASS is entirely missing from your .env file!");
} else if (pass.includes(' ')) {
    console.log("❌ ERROR: Your App Password has spaces in it. It should be exactly 16 letters with NO spaces.");
} else if (pass.length !== 16) {
    console.log(`❌ ERROR: Your App Password is ${pass.length} characters long. A Gmail App Password must be EXACTLY 16 characters.`);
} else {
    console.log("✅ The App Password formatting seems perfectly correct (16 chars, no spaces).");
}

if (!email) {
    console.log("❌ ERROR: EMAIL_USER is missing.");
} else if (!email.includes('@gmail.com')) {
    console.log("❌ ERROR: EMAIL_USER must be a valid @gmail.com address.");
} else {
    console.log(`✅ Email appears valid: ${email}`);
}
