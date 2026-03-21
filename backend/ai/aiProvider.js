import dotenv from 'dotenv';

dotenv.config();

// --- Rule-based helpers (instant, no AI needed) ---
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
        this.ollamaUrl = process.env.LLAMA_API_BASE_URL?.replace('/v1', '') || 'http://localhost:11434';
        this.model = process.env.LLAMA_MODEL || 'llama3:latest';
        console.log(`AI Provider: rule-based + Ollama model=${this.model}`);
    }

    async analyzeResume(text) {
        // Immediately extract everything with fast rule-based methods
        const skills = extractSkills(text);
        const experience = extractExperience(text);
        const education = extractEducation(text);
        const atsScore = calcAtsScore(text, skills);
        const summary = extractSummary(text);

        console.log(`Rule-based extraction: ${skills.length} skills, ATS=${atsScore}`);

        // Try to enhance with a quick Ollama call (with a short timeout)
        // If Ollama is too slow, we return the rule-based result immediately
        try {
            const snippet = text.substring(0, 800);
            const prompt = `From this resume, list only the top 5 additional technical skills not in: ${skills.slice(0,5).join(', ')}. Reply with a JSON array only, like ["skill1","skill2"]. No other text.\n\nResume: ${snippet}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second max

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, prompt, stream: false }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            const raw = data.response || '';
            console.log('Ollama enhance reply:', raw.substring(0, 100));

            const arrMatch = raw.match(/\[[\s\S]*?\]/);
            if (arrMatch) {
                const extra = JSON.parse(arrMatch[0].replace(/,\s*([\]])/g, '$1'));
                const allSkills = [...new Set([...skills, ...extra])];
                return { skills: allSkills, techStack: allSkills, atsScore, summary, experience, education };
            }
        } catch (err) {
            console.log('Ollama enhancement skipped (slow/unavailable):', err.message);
        }

        // Return rule-based result immediately
        return { skills, techStack: skills, atsScore, summary, experience, education };
    }

    async compareToJob(resumeText, jobDescription) {
        // Rule-based comparison
        const resumeSkills = extractSkills(resumeText);
        const jobSkills = extractSkills(jobDescription);
        const jobWords = jobDescription.toLowerCase().split(/\W+/);
        
        const missing = jobSkills.filter(s => !resumeSkills.includes(s));
        const matching = jobSkills.filter(s => resumeSkills.includes(s));
        const score = jobSkills.length > 0 ? Math.round((matching.length / jobSkills.length) * 100) : 50;

        const result = {
            compatibilityScore: score,
            missingKeywords: missing,
            improvements: missing.slice(0, 5).map(k => `Add ${k} to your skills or experience section`),
            optimizedBullets: resumeText.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•')).slice(0, 3)
        };

        // Try a quick Ollama call for better insights (30 sec timeout)
        try {
            const prompt = `Compare this resume to the job. Give 3 brief improvement tips. Return ONLY JSON: {"improvements":["tip1","tip2","tip3"]}. No other text.\n\nResume: ${resumeText.substring(0,500)}\nJob: ${jobDescription.substring(0,500)}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, prompt, stream: false }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            const raw = data.response || '';
            const first = raw.indexOf('{');
            const last = raw.lastIndexOf('}');
            if (first !== -1) {
                const parsed = JSON.parse(raw.substring(first, last + 1));
                if (parsed.improvements) result.improvements = parsed.improvements;
            }
        } catch (err) {
            console.log('Ollama compare skipped:', err.message);
        }

        return result;
    }

    async generateEmbeddings(text) {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, prompt: text }),
            });
            const data = await response.json();
            return data.embedding;
        } catch (error) {
            console.error('Embedding Error:', error.message);
            throw new Error('Failed to generate embeddings');
        }
    }
    async generateCoverLetter(resumeText, jobDescription, tone = 'formal') {
        const tonePrompts = {
            formal: "professional and standard business",
            friendly: "warm, approachable and enthusiastic",
            confident: "bold, high-energy and result-oriented"
        };
        const selectedTone = tonePrompts[tone] || tonePrompts.formal;

        try {
            const prompt = `You are an expert career coach. Generate a high-impact cover letter for this user based on their resume and the job description.
            Tone: ${selectedTone}
            Resume: ${resumeText.substring(0, 1500)}
            Job Description: ${jobDescription.substring(0, 1500)}
            
            Return only the cover letter text. Start with Date and Contact info if possible, otherwise start with 'Dear Hiring Manager'. 
            Do not include any intro/outro like 'Here is your cover letter'.`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 1 min timeout

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, prompt, stream: false }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();
            return data.response.trim();
        } catch (error) {
            console.log('Ollama Cover Letter generation failed (connection/timeout). Using smart fallback template.');
            
            // Rule-based high-quality template fallback
            const skills = extractSkills(resumeText).slice(0, 5).join(', ');
            const jobTitle = jobDescription.split('\n')[0].substring(0, 50) || "the position";
            
            return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position. With my background in software development and my technical expertise in ${skills}, I am confident that I would be a valuable asset to your team.

Throughout my career, I have consistently demonstrated a commitment to excellence and a passion for building high-quality solutions. My resume highlights my experience in developing complex applications and collaborating with cross-functional teams to deliver impactful results.

The requirements mentioned in your job description align perfectly with my skillset. I am particularly drawn to your company's mission and am eager to contribute to your continued success.

Thank you for your time and consideration. I look forward to the possibility of discussing how my experience and skills can benefit your organization.

Sincerely,
(AI Generation Note: This is an optimized template because your local LLaMA instance was unreachable.)`;
        }
    }
    async generateInterviewQuestions(resumeText) {
        try {
            const prompt = `You are a professional technical interviewer.

Based on the following resume:

${resumeText.substring(0, 2000)}

Generate:

1. 5 Technical Interview Questions
2. 5 Project-Based Questions (especially about projects mentioned)
3. 5 HR / Behavioral Questions

Make questions realistic, relevant, and commonly asked in real interviews.

Keep them concise and well-structured.`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, prompt, stream: false }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();
            const raw = data.response.trim();

            // Simple parsing logic: split by numbers or sections
            const lines = raw.split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(l => l.length > 5 && !l.toLowerCase().includes('interview questions') && !l.toLowerCase().includes('behavioral questions'));
            
            // Heuristic categorization if AI doesn't give clear markers (though prompt asks for 1, 2, 3)
            // But since I need structured {technical:[], project:[], hr:[]}
            // Let's try a better split
            const parts = raw.split(/1\.|2\.|3\.|technical|project|hr/i);
            const technical = [];
            const project = [];
            const hr = [];

            // If parsing fails, we use a more basic approach or return raw
            // Actually, let's try to extract lists
            const allQuestions = raw.match(/\?|\n\d+\..*?\n/g) ? raw.split('\n').filter(l => l.includes('?') || /^\d+\./.test(l)) : [];
            
            // To abide by "Use this exact prompt", I'll just do a basic split by sections
            const technicalMatch = raw.match(/(?:Technical Interview Questions|1\.)([\s\S]*?)(?:Project-Based|2\.|$)/i);
            const projectMatch = raw.match(/(?:Project-Based Questions|2\.)([\s\S]*?)(?:HR|Behavioral|3\.|$)/i);
            const hrMatch = raw.match(/(?:HR \/ Behavioral Questions|3\.)([\s\S]*?)(?:$)/i);

            const extractList = (text) => {
                if (!text) return [];
                return text.split('\n')
                    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
                    .filter(l => l.length > 10 && (l.includes('?') || l.length > 20))
                    .slice(0, 5);
            };

            return {
                technical: extractList(technicalMatch?.[1]),
                project: extractList(projectMatch?.[1]),
                hr: extractList(hrMatch?.[1])
            };

        } catch (error) {
            console.error('Interview Questions Error:', error.message);
            // Fallback for demo
            return {
                technical: ["Explain your core tech stack in detail.", "How do you handle state management?", "Describe a difficult bug you solved recently.", "What is the difference between SQL and NoSQL?", "Explain the concept of middleware."],
                project: ["What was your role in your most recent project?", "How did you handle scalability in your projects?", "Describe a technical challenge from your portfolio.", "Which technology did you choose for your backend and why?", "How did you test your application?"],
                hr: ["Why should we hire you?", "Where do you see yourself in 5 years?", "Tell me about a time you worked in a team.", "How do you handle tight deadlines?", "What are your strengths and weaknesses?"]
            };
        }
    }
}

export default new AIProvider();
