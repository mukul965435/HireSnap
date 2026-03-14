/**
 * Adzuna Real Jobs Adapter
 * Docs: https://developer.adzuna.com/
 */

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api';

/**
 * Infer expected skills from the job TITLE.
 * Adzuna India descriptions are often generic HR text with no tech keywords,
 * so we match against the role title instead.
 */
const inferSkillsFromTitle = (title) => {
    const t = title.toLowerCase();

    if (t.includes('frontend') || t.includes('front-end') || t.includes('front end') || t.includes('ui developer') || t.includes('ui engineer')) {
        return ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue'];
    }
    if (t.includes('backend') || t.includes('back-end') || t.includes('back end') || t.includes('server side')) {
        return ['Node.js', 'Python', 'Java', 'SQL', 'Express', 'REST', 'MongoDB'];
    }
    if (t.includes('full stack') || t.includes('fullstack') || t.includes('full-stack')) {
        return ['React', 'Node.js', 'JavaScript', 'MongoDB', 'SQL', 'REST', 'HTML', 'CSS'];
    }
    if (t.includes('react')) {
        return ['React', 'JavaScript', 'HTML', 'CSS', 'Redux', 'TypeScript'];
    }
    if (t.includes('angular')) {
        return ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'RxJS'];
    }
    if (t.includes('node') || t.includes('nodejs')) {
        return ['Node.js', 'JavaScript', 'Express', 'MongoDB', 'REST', 'SQL'];
    }
    if (t.includes('python')) {
        return ['Python', 'Django', 'Flask', 'SQL', 'REST', 'Git'];
    }
    if (t.includes('java') && !t.includes('javascript')) {
        return ['Java', 'Spring', 'Spring Boot', 'SQL', 'Maven', 'REST'];
    }
    if (t.includes('machine learning') || t.includes('ml engineer') || t.includes('ai engineer')) {
        return ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'SQL', 'NumPy'];
    }
    if (t.includes('data engineer') || t.includes('data pipeline')) {
        return ['Python', 'SQL', 'Spark', 'Airflow', 'Kafka', 'AWS', 'Data Engineering'];
    }
    if (t.includes('data scientist') || t.includes('data science')) {
        return ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy', 'Tableau'];
    }
    if (t.includes('devops') || t.includes('site reliability') || t.includes('sre') || t.includes('platform engineer')) {
        return ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Git'];
    }
    if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('gcp')) {
        return ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'];
    }
    if (t.includes('mobile') || t.includes('android') || t.includes('ios')) {
        return ['Kotlin', 'Swift', 'Flutter', 'React Native', 'Dart', 'Java'];
    }
    if (t.includes('flutter') || t.includes('react native')) {
        return ['Flutter', 'Dart', 'React Native', 'JavaScript', 'Mobile', 'Firebase'];
    }
    if (t.includes('database') || t.includes('dba') || t.includes('sql developer')) {
        return ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Oracle Database', 'Redis'];
    }
    if (t.includes('software developer') || t.includes('software engineer') || t.includes('software development')) {
        // Generic software role — return a mix of common skills
        return ['JavaScript', 'Python', 'Java', 'SQL', 'Git', 'REST', 'Agile'];
    }
    if (t.includes('software')) {
        return ['JavaScript', 'Python', 'Java', 'SQL', 'Git'];
    }

    return [];
};

/**
 * Also try to detect skills directly from the description text (best-effort).
 */
const SKILL_KEYWORDS = [
    'javascript', 'python', 'java', 'typescript', 'php', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'html', 'css', 'tailwind', 'bootstrap', 'redux',
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'fastapi', 'graphql',
    'mongodb', 'sql', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'firebase',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'linux', 'git',
    'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'spark', 'kafka', 'airflow',
    'flutter', 'kotlin', 'swift', 'android', 'ios', 'react native',
    'agile', 'scrum', 'rest', 'api', 'microservices'
];

const detectSkillsFromDescription = (text) => {
    const lower = text.toLowerCase();
    const found = [];
    for (const kw of SKILL_KEYWORDS) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(lower)) {
            const label = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            if (!found.includes(label)) found.push(label);
        }
    }
    return found;
};

/**
 * Calculate match score:
 * - First check how many user skills overlap with inferred title skills
 * - Then check description text as secondary pass
 * - Return the higher of the two
 */
const calcMatchScore = (jobTitle, rawDescription, userSkills) => {
    if (!userSkills || userSkills.length === 0) return 0;

    const userSkillsLower = userSkills.map(s => s.toLowerCase().trim());
    
    // --- Pass 1: Title-inferred skills vs user skills ---
    const titleSkills = inferSkillsFromTitle(jobTitle);
    const titleSkillsLower = titleSkills.map(s => s.toLowerCase());
    
    let titleMatches = 0;
    for (const us of userSkillsLower) {
        if (titleSkillsLower.some(ts => ts.includes(us) || us.includes(ts))) {
            titleMatches++;
        }
    }
    const titleScore = titleSkills.length > 0
        ? Math.round((titleMatches / Math.min(userSkillsLower.length, titleSkills.length)) * 100)
        : 0;

    // --- Pass 2: User skills directly in description text ---
    let descMatches = 0;
    const descLower = rawDescription.toLowerCase();
    for (const us of userSkillsLower) {
        if (us.length < 2) continue;
        const escaped = us.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(descLower)) descMatches++;
    }
    const descScore = Math.round((descMatches / userSkillsLower.length) * 100);

    // Take the better of the two passes
    return Math.max(titleScore, descScore);
};

/**
 * Build a smart Adzuna search query from user skills.
 */
const buildSearchQuery = (skills = []) => {
    if (!skills || skills.length === 0) return 'software developer';
    const lower = skills.map(s => s.toLowerCase());

    if (lower.some(s => ['machine learning', 'tensorflow', 'pytorch', 'deep learning', 'nlp'].includes(s)))
        return 'machine learning engineer';
    if (lower.some(s => ['react', 'angular', 'vue', 'next.js'].includes(s)))
        return 'frontend developer react javascript';
    if (lower.some(s => ['node.js', 'nodejs', 'express'].includes(s)))
        return 'backend developer node javascript';
    if (lower.some(s => ['flutter', 'react native', 'android', 'ios'].includes(s)))
        return 'mobile app developer';
    if (lower.some(s => ['spark', 'kafka', 'airflow', 'hadoop', 'data engineer'].includes(s)))
        return 'data engineer python';
    if (lower.some(s => ['aws', 'docker', 'kubernetes', 'devops', 'terraform'].includes(s)))
        return 'devops engineer cloud aws';
    if (lower.some(s => ['python', 'django', 'flask'].includes(s)))
        return 'python developer';
    if (lower.some(s => ['java', 'spring', 'spring boot'].includes(s)))
        return 'java developer spring';
    if (lower.some(s => ['javascript', 'typescript'].includes(s)))
        return 'javascript developer fullstack';

    const primary = skills.filter(s => s.length > 3)[0] || skills[0];
    return `${primary} developer`;
};

const normalizeJob = (job, userSkills = []) => {
    const title = job.title || 'Unknown Role';
    const company = job.company?.display_name || 'Not Listed';
    const location = job.location?.display_name || 'Not Specified';
    const rawDescription = job.description || '';

    // Combine title-inferred skills + description-detected skills for display
    const titleSkills = inferSkillsFromTitle(title);
    const descSkills = detectSkillsFromDescription(rawDescription);

    // Merge and deduplicate, title skills first (more accurate)
    const allSkills = [...titleSkills];
    for (const ds of descSkills) {
        if (!allSkills.some(ts => ts.toLowerCase() === ds.toLowerCase())) {
            allSkills.push(ds);
        }
    }

    // Calculate match score
    const matchScore = calcMatchScore(title, rawDescription, userSkills);

    // Format salary
    let salary = null;
    if (job.salary_min && job.salary_max) {
        const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${Math.round(n / 1000)}K`;
        salary = `₹${fmt(job.salary_min)} – ₹${fmt(job.salary_max)} / yr`;
    } else if (job.salary_min) {
        salary = `₹${(job.salary_min / 100000).toFixed(1)}L+ / yr`;
    }

    // Clean description
    let description = rawDescription
        .replace(/Date Posted\s*:\s*.+/g, '')
        .replace(/Req\s*(Id|ID)\s*:\s*\S+/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    if (description.length > 220) description = description.substring(0, 220).trimEnd() + '...';

    return {
        id: job.id,
        title,
        company,
        location,
        type: job.contract_time === 'full_time' ? 'Full-time'
            : job.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
        skills: allSkills.slice(0, 7),
        salary,
        description,
        url: job.redirect_url || '#',
        postedAt: job.created ? new Date(job.created).toLocaleDateString('en-IN') : null,
        source: 'Adzuna',
        matchScore
    };
};

const adzunaAdapter = {
    name: 'adzuna',

    async fetchJobs(skills = [], location = '') {
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;
        const country = process.env.ADZUNA_COUNTRY || 'in';

        if (!appId || !appKey || appId === 'your_adzuna_app_id') {
            console.warn('[Adzuna] Not configured — returning empty list.');
            return [];
        }

        try {
            const query = buildSearchQuery(skills);
            const locationParam = location ? `&where=${encodeURIComponent(location)}` : '';

            console.log(`[Adzuna] Query: "${query}" | Country: ${country}`);

            // Fetch page 1 only to avoid Adzuna free tier rate limiting
            const url =
                `${ADZUNA_BASE_URL}/jobs/${country}/search/1` +
                `?app_id=${appId}&app_key=${appKey}` +
                `&results_per_page=20` +
                `&what=${encodeURIComponent(query)}` +
                `&content-type=application/json${locationParam}`;

            const response = await fetch(url);

            // Guard: Adzuna may return an HTML error page on rate limit/auth issues
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
                console.warn('[Adzuna] Non-JSON response received (likely rate limited). Returning empty.');
                return [];
            }

            const data = await response.json();

            if (!Array.isArray(data.results)) {
                if (data.exception) console.error('[Adzuna] API error:', data.exception);
                return [];
            }

            const jobs = data.results.map(j => normalizeJob(j, skills));
            console.log(`[Adzuna] Fetched ${jobs.length} real jobs.`);
            return jobs;
        } catch (err) {
            console.error('[Adzuna] Error:', err.message);
            return [];
        }
    }
};

export default adzunaAdapter;
