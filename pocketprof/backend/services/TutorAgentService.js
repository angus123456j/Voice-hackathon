const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class TutorAgentService {
    constructor() {
        this.electronApiKey = process.env.SMALLEST_ELECTRON_API_KEY || process.env.SMALLEST_API_KEY;
        this.electronApiUrl = 'https://waves-api.smallest.ai/api/v1/chat/completions';
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.conversationHistory = new Map();

        if (this.geminiApiKey) {
            this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
            this.geminiModel = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
        }
    }

    async initializeTutor(sessionId, knowledge, slideCount) {
        console.log('Initializing AI tutor with Google Gemini...');
        this.conversationHistory.set(sessionId, []);
        return { status: 'initialized', message: 'AI Tutor is ready' };
    }

    async generateNarration(sessionId, knowledge, currentSlide = 0) {
        if (this.geminiModel) {
            try {
                return await this.generateNarrationGemini(sessionId, knowledge, currentSlide);
            } catch (error) {
                console.error('Gemini narration failed:', error.message);
            }
        }

        try {
            if (!this.electronApiKey) return this.getMockNarration(currentSlide);

            const systemPrompt = `You are an AI tutor. Explain concepts clearly and pedagogically based on the knowledge document.
Format: JSON { "speech": string, "navigate_to_slide": number }`;

            const response = await axios.post(
                this.electronApiUrl,
                {
                    model: 'electron-v2',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Knowledge:\n${JSON.stringify(knowledge)}\nSlide: ${currentSlide}` },
                    ],
                    response_format: { type: 'json_object' },
                },
                {
                    headers: { 'Authorization': `Bearer ${this.electronApiKey}`, 'Content-Type': 'application/json' },
                    timeout: 60000,
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            return this.getMockNarration(currentSlide);
        }
    }

    async generateNarrationGemini(sessionId, knowledge, currentSlide) {
        console.log('Generating study narration with Gemini...');

        const prompt = `You are an AI tutor delivering a lecture based strictly on the provided knowledge.
Explain concepts clearly and pedagogically. Reference slides when appropriate.
Format: JSON { "speech": string, "navigate_to_slide": number }

Knowledge: ${JSON.stringify(knowledge)}
Current Slide: ${currentSlide}`;

        const result = await this.geminiModel.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    async answerQuestion(sessionId, question, knowledge, currentSlide) {
        if (this.geminiModel) {
            try {
                return await this.answerQuestionGemini(sessionId, question, knowledge, currentSlide);
            } catch (error) {
                console.error('Gemini question answer failed:', error.message);
            }
        }

        return this.getMockAnswer(question);
    }

    async answerQuestionGemini(sessionId, question, knowledge, currentSlide) {
        console.log('Answering student question with Gemini...');
        const history = this.conversationHistory.get(sessionId) || [];

        const prompt = `You are an AI lecture tutor. Answer the student's question based strictly on the lecture content.
Format: JSON { "speech": string, "navigate_to_slide": number }

Lecture Context: ${JSON.stringify(knowledge)}
Current Slide: ${currentSlide}
Conversation History: ${JSON.stringify(history)}
Student Question: ${question}`;

        const result = await this.geminiModel.generateContent(prompt);
        const answer = JSON.parse(result.response.text());

        history.push({ role: 'user', content: question }, { role: 'assistant', content: answer.speech });
        this.conversationHistory.set(sessionId, history.slice(-10));
        return answer;
    }

    getMockNarration(currentSlide) {
        const narrations = [
            {
                speech: "Welcome to today's lecture on Machine Learning Fundamentals. We'll be exploring neural networks, starting with the basics of how they process information and learn from data. Let's begin with the perceptron.",
                navigate_to_slide: 0
            },
            {
                speech: "The perceptron is the fundamental building block of neural networks. It takes multiple inputs, applies weights to them, sums them up, and passes the result through an activation function to produce an output.",
                navigate_to_slide: 1
            },
            {
                speech: "Now let's discuss loss functions, which are crucial for training neural networks. The loss function measures how well our model's predictions match the actual values.",
                navigate_to_slide: 2
            },
        ];

        return narrations[currentSlide % narrations.length];
    }

    getMockAnswer(question) {
        return {
            speech: `That's a great question about "${question}". Based on the lecture content, the key point to understand is that neural networks learn through iterative weight adjustments using gradient descent. The activation function introduces non-linearity, allowing the network to learn complex patterns.`,
            navigate_to_slide: undefined
        };
    }

    clearHistory(sessionId) {
        this.conversationHistory.delete(sessionId);
    }
}

module.exports = TutorAgentService;
