import nodemailer from 'nodemailer';

const sendTokenEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'HireSnap Password Reset OTP',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #3b82f6; text-align: center;">HireSnap</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the OTP below to proceed. This OTP is valid for 10 minutes.</p>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <h1 style="margin: 0; letter-spacing: 5px; color: #1e293b;">${otp}</h1>
                </div>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p>Thanks,<br/>The HireSnap Team</p>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email send failed:', error);
        return false;
    }
};

export { sendTokenEmail };
