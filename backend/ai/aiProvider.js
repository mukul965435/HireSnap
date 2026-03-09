import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class AIProvider {
    constructor() {
        // Using LLaMA (via Ollama or any OpenAI-compatible provider)
        this.client = new OpenAI({
            baseURL: process.env.LLAMA_API_BASE_URL || 'http://localhost:11434/v1',
            apiKey: process.env.LLAMA_API_KEY || 'ollama',
        });
        this.model = process.env.LLAMA_MODEL || 'llama3';
    }

    async analyzeResume(text) {
        const prompt = `
            You are an expert ATS (Applicant Tracking System) evaluator.
            Analyze the following resume text and extract structured data.
            Return the output strictly in JSON format with the following structure:
            {
                "skills": ["skill1", "skill2"],
                "experience": [{"company": "...", "role": "...", "duration": "...", "description": "..."}],
                "education": [{"institution": "...", "degree": "...", "year": "..."}],
                "techStack": ["tech1", "tech2"],
                "summary": "...",
                "atsScore": number (0-100)
            }

            Resume Text:
            ${text}
        `;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                // Note: LLaMA models might sometimes need specific instructions for JSON
                // We'll keep the response_format if the provider supports it, 
                // but some local LLM providers might ignore it.
                response_format: { type: "json_object" }
            });

            // Clean up response in case model returns markdown blocks
            let content = response.choices[0].message.content;
            if (content.includes('```json')) {
                content = content.split('```json')[1].split('```')[0].trim();
            } else if (content.includes('```')) {
                content = content.split('```')[1].split('```')[0].trim();
            }

            return JSON.parse(content);
        } catch (error) {
            console.error('LLaMA AI Analysis Error:', error);
            throw new Error('Failed to analyze resume with LLaMA');
        }
    }

    async compareToJob(resumeText, jobDescription) {
        const prompt = `
            You are an ATS evaluator. Compare the following resume with the job description.
            Return output strictly in JSON format:
            {
                "compatibilityScore": number (0-100),
                "missingKeywords": ["keyword1", "keyword2"],
                "improvements": ["improvement1", "improvement2"],
                "optimizedBullets": ["bullet1", "bullet2", "bullet3"]
            }

            Resume:
            ${resumeText}

            Job Description:
            ${jobDescription}
        `;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });

            let content = response.choices[0].message.content;
            if (content.includes('```json')) {
                content = content.split('```json')[1].split('```')[0].trim();
            } else if (content.includes('```')) {
                content = content.split('```')[1].split('```')[0].trim();
            }

            return JSON.parse(content);
        } catch (error) {
            console.error('LLaMA Comparison Error:', error);
            throw new Error('Failed to compare resume to job with LLaMA');
        }
    }

    async generateEmbeddings(text) {
        try {
            // Most local LLaMA providers (like Ollama) support the embeddings endpoint
            const response = await this.client.embeddings.create({
                model: this.model,
                input: text,
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('LLaMA Embedding Error:', error);
            // Fallback: If embeddings fail, return a dummy vector or throw
            throw new Error('Failed to generate embeddings with LLaMA provider');
        }
    }
}

export default new AIProvider();
