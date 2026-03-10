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
}

export default new AIProvider();
