import { generateAIResponse } from './groqService.js';

// --- Rule-based helpers (remains untouched) ---
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSkills(text) {
    const commonSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
        'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Firebase', 'Supabase',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'CI/CD',
        'Git', 'GitHub', 'Linux', 'REST', 'GraphQL', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
        'Machine Learning', 'TensorFlow', 'PyTorch', 'OpenAI', 'LangChain',
        'Figma', 'Jest', 'Mocha', 'Selenium', 'Playwright', 'Agile', 'Scrum'
    ];
    const found = commonSkills.filter(skill =>
        new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i').test(text)
    );
    return [...new Set(found)];
}

function extractExperience(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const exp = [];
    let inExp = false;
    for (const line of lines) {
        if (/experience|work history|employment/i.test(line)) { inExp = true; continue; }
        if (/education|skills|projects|certifications|achievements/i.test(line)) { inExp = false; }
        if (inExp && line.length > 10 && exp.length < 5) {
            exp.push({ role: line, company: '', duration: '' });
        }
    }
    return exp;
}

function extractEducation(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const edu = [];
    let inEdu = false;
    for (const line of lines) {
        if (/education|academic|qualification/i.test(line)) { inEdu = true; continue; }
        if (/experience|skills|projects|certifications/i.test(line)) { inEdu = false; }
        if (inEdu && line.length > 5 && edu.length < 3) {
            edu.push({ institution: line, degree: '', year: '' });
        }
    }
    return edu;
}

function calcAtsScore(text, skills) {
    let score = 30; // base score
    score += Math.min(skills.length * 2, 20); // up to 20 pts for skills (10+ skills = max)
    if (/github|portfolio/i.test(text)) score += 5;
    if (/linkedin/i.test(text)) score += 3;
    if (/achievements?|accomplishments?/i.test(text)) score += 5;
    if (/\d+%|\d+x|increased|improved|reduced/i.test(text)) score += 7;
    if (/led|built|designed|architected|developed/i.test(text)) score += 5;
    if (text.length > 1500) score += 5;
    if (text.split('\n').filter(l => l.trim()).length > 20) score += 5; // good structure
    if (/summary|objective/i.test(text)) score += 5;
    return Math.min(score, 98); // cap at 98, not 100
}

function extractSummary(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 30);
    // Try to find a summary/objective section
    for (let i = 0; i < lines.length; i++) {
        if (/summary|objective|profile/i.test(lines[i]) && lines[i + 1]) {
            return lines[i + 1].substring(0, 200);
        }
    }
    // Fallback: use first substantial line
    return lines[0]?.substring(0, 200) || '';
}

class AIProvider {
    constructor() {
        console.log("AI Provider: Groq Cloud Layer initialized");
    }

    async analyzeResume(text) {
        // Immediately extract everything with fast rule-based methods
        const skills = extractSkills(text);
        const experience = extractExperience(text);
        const education = extractEducation(text);
        const atsScore = calcAtsScore(text, skills);
        const summary = extractSummary(text);

        console.log(`Rule-based: ${skills.length} skills. Calling Groq enhancement...`);

        // Enhance with Groq
        try {
            const snippet = text.substring(0, 800);
            const prompt = `From this resume, list only the top 5 additional technical skills not in: ${skills.slice(0,5).join(', ')}. Reply with a JSON array only, like ["skill1","skill2"]. No other text.\n\nResume: ${snippet}`;
            
            const raw = await generateAIResponse(prompt);
            console.log('Groq enhance reply received');

            const arrMatch = raw.match(/\[[\s\S]*?\]/);
            if (arrMatch) {
                const extra = JSON.parse(arrMatch[0].replace(/,\s*([\]])/g, '$1'));
                const allSkills = [...new Set([...skills, ...extra])];
                return { skills: allSkills, techStack: allSkills, atsScore, summary, experience, education };
            }
        } catch (err) {
            console.log('Groq enhancement skipped:', err.message);
        }

        // Return rule-based result immediately
        return { skills, techStack: skills, atsScore, summary, experience, education };
    }

    async compareToJob(resumeText, jobDescription) {
        // Rule-based comparison
        const resumeSkills = extractSkills(resumeText);
        const jobSkills = extractSkills(jobDescription);
        
        const missing = jobSkills.filter(s => !resumeSkills.includes(s));
        const matching = jobSkills.filter(s => resumeSkills.includes(s));
        const score = jobSkills.length > 0 ? Math.round((matching.length / jobSkills.length) * 100) : 50;

        const result = {
            compatibilityScore: score,
            missingKeywords: missing,
            improvements: missing.slice(0, 5).map(k => `Add ${k} to your skills or experience section`),
            optimizedBullets: resumeText.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•')).slice(0, 3)
        };

        // Groq call for better insights
        try {
            const prompt = `Compare this resume to the job. Give 3 brief improvement tips. Return ONLY JSON: {"improvements":["tip1","tip2","tip3"]}. No other text.\n\nResume: ${resumeText.substring(0,500)}\nJob: ${jobDescription.substring(0,500)}`;
            const raw = await generateAIResponse(prompt);
            const first = raw.indexOf('{');
            const last = raw.lastIndexOf('}');
            if (first !== -1) {
                const parsed = JSON.parse(raw.substring(first, last + 1));
                if (parsed.improvements) result.improvements = parsed.improvements;
            }
        } catch (err) {
            console.log('Groq compare skipped:', err.message);
        }

        return result;
    }

    async generateEmbeddings(text) {
        // Since Groq doesn't provide easy public embedding endpoint same as Ollama,
        // we fallback or provide a note. (Ollama previously used /api/embeddings)
        // For now, return a placeholder or mock if not strictly required for current features
        console.warn('Groq embedding endpoint unavailable; using placeholder.');
        return new Array(768).fill(0);
    }

    async generateCoverLetter(resumeText, jobDescription, tone = 'formal') {
        const tonePrompts = {
            formal: "professional and standard business",
            friendly: "warm, approachable and enthusiastic",
            confident: "bold, high-energy and result-oriented"
        };
        const selectedTone = tonePrompts[tone] || tonePrompts.formal;

        try {
            const prompt = `You are an expert career coach. Generate a high-impact cover letter based on this resume and job description.
            Tone: ${selectedTone}
            Resume: ${resumeText.substring(0, 1500)}
            Job Description: ${jobDescription.substring(0, 1500)}
            
            Return ONLY the cover letter body text. Do not add intro/outro comments. Start with 'Dear Hiring Manager'.`;

            return await generateAIResponse(prompt);
        } catch (error) {
            console.log('Groq generation failed. Using rule-fallback.');
            const skills = extractSkills(resumeText).slice(0, 5).join(', ');
            return `Dear Hiring Manager,\n\nI am writing to express interest based on my experience in ${skills}. [Fallback Template activated; Groq currently busy]`;
        }
    }

    async generateInterviewQuestions(resumeText) {
        try {
            const prompt = `You are a professional technical interviewer.
Based on the following resume:
${resumeText.substring(0, 2000)}
Generate:
1. 5 Technical Interview Questions
2. 5 Project-Based Questions
3. 5 HR / Behavioral Questions
Realistic and concise. Use 1., 2., 3. markers.`;

            const raw = await generateAIResponse(prompt);
            
            // Reusing existing parsing logic
            const technicalMatch = raw.match(/(?:Technical|1\.)([\s\S]*?)(?:Project|2\.|$)/i);
            const projectMatch = raw.match(/(?:Project|2\.)([\s\S]*?)(?:HR|Behavioral|3\.|$)/i);
            const hrMatch = raw.match(/(?:HR \/ Behavioral Questions|3\.)([\s\S]*?)(?:$)/i);

            const extractList = (text) => {
                if (!text) return [];
                return text.split('\n')
                    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
                    .filter(l => l.length > 10)
                    .slice(0, 5);
            };

            return {
                technical: extractList(technicalMatch?.[1]),
                project: extractList(projectMatch?.[1]),
                hr: extractList(hrMatch?.[1])
            };

        } catch (error) {
            console.error('Groq Interview Questions Error:', error.message);
            return { technical: ["Explain your core tech stack."], project: ["Tell me about your role."], hr: ["Why hire you?"] };
        }
    }
}

export default new AIProvider();
