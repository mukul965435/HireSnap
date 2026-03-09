import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    rawText: {
        type: String,
        required: true
    },
    parsedData: {
        skills: [String],
        experience: [Object],
        education: [Object],
        techStack: [String],
        summary: String
    },
    atsScore: {
        type: Number,
        default: 0
    },
    version: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
Resume.schema.index({ user: 1, createdAt: -1 });
export default Resume;
