import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
});

async function test() {
    try {
        console.log('Testing Ollama OpenAI endpoint...');
        const response = await client.chat.completions.create({
            model: 'llama3:latest',
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 5
        });
        console.log('Response:', response.choices[0].message.content);
    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
}

test();
