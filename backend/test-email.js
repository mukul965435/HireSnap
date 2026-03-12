import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: 'c:/Users/ritik/Desktop/HireSnap/backend/.env' });

console.log("Using Email:", process.env.EMAIL_USER);
console.log("Using Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const testEmail = async () => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // send to self
            subject: 'Test Email',
            text: 'This is a test.'
        });

        console.log("Success:", info.messageId);
    } catch (error) {
        console.error("Failed:", error);
    }
};

testEmail();
