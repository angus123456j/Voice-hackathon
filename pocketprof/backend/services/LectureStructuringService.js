const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LectureStructuringService {
    constructor() {
        this.electronApiKey = process.env.SMALLEST_ELECTRON_API_KEY || process.env.SMALLEST_API_KEY;
        this.electronApiUrl = 'https://waves-api.smallest.ai/api/v1/chat/completions';
        this.geminiApiKey = process.env.GEMINI_API_KEY;

        if (this.geminiApiKey) {
            this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
            this.geminiModel = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
        }
    }

    async structureTranscript(transcript) {
        // Prioritize Gemini as requested
        if (this.geminiModel) {
            try {
                return await this.summarizeWithGemini(transcript);
            } catch (error) {
                console.error('Gemini structuring failed:', error.message);
            }
        }

        try {
            console.log('Structuring transcript with Smallest.ai Electron (Fallback)...');

            if (!this.electronApiKey) {
                console.warn('Smallest.ai Electron API key not configured, using mock knowledge');
                return this.getMockKnowledge();
            }

            const systemPrompt = `You are an expert at structuring lecture transcripts into well-organized knowledge documents.
Extract sections, key concepts, LaTeX equations, student questions, and a summary.
Return ONLY valid JSON.`;

            const response = await axios.post(
                this.electronApiUrl,
                {
                    model: 'electron-v2',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Transcript:\n\n${transcript}` },
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.3,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.electronApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000,
                }
            );

            const knowledge = JSON.parse(response.data.choices[0].message.content);
            return this.validateKnowledge(knowledge);

        } catch (error) {
            console.error('Structuring error:', error.message);
            return this.getMockKnowledge();
        }
    }

    async summarizeWithGemini(transcript) {
        console.log('Generating expert summary with Google Gemini...');

        const prompt = `You are an expert at structuring lecture transcripts into well-organized knowledge documents.
Analyze the following transcript and create a concise, well-structured summary.

Extract:
1. Sections with clear titles
2. Key concepts and topics discussed
3. Notable quotes or specific clarifications
4. Mathematical equations in LaTeX format (if any)
5. A comprehensive summary

Return ONLY valid JSON in this exact format:
{
  "summary": "2-3 sentence overview of the lecture",
  "key_definitions": ["Main takeaway 1", "Main takeaway 2"],
  "sections": [
    {
      "title": "Section Title",
      "concepts": ["Key point 1", "Key point 2"],
      "equations_latex": ["LaTeX equation 1"],
      "student_questions": ["Question asked"],
      "clarifications": ["Clarification provided"]
    }
  ]
}

TRANSCRIPT:
${transcript}`;

        const result = await this.geminiModel.generateContent(prompt);
        const responseText = result.response.text();

        console.log('Gemini summary generated successfully');
        const knowledge = JSON.parse(responseText);
        return this.validateKnowledge(knowledge);
    }

    validateKnowledge(knowledge) {
        // Ensure required fields exist
        return {
            sections: knowledge.sections || [],
            summary: knowledge.summary || '',
            key_definitions: knowledge.key_definitions || knowledge.key_points || [],
        };
    }

    getMockKnowledge() {
        return {
            sections: [
                {
                    title: "Introduction to Neural Networks",
                    concepts: [
                        "Perceptron as the simplest neural network",
                        "Input-weight-output relationship",
                        "Role of activation functions"
                    ],
                    equations_latex: [
                        "y = \\sigma(w_1x_1 + w_2x_2 + ... + w_nx_n + b)",
                        "\\sigma(z) = \\frac{1}{1 + e^{-z}}"
                    ],
                    student_questions: [
                        "What's the difference between the activation function and the loss function?"
                    ],
                    clarifications: [
                        "Activation function introduces non-linearity in neurons",
                        "Loss function measures model performance"
                    ]
                },
                {
                    title: "Loss Functions",
                    concepts: [
                        "Mean Squared Error for regression",
                        "Cross-entropy for classification",
                        "Measuring prediction accuracy"
                    ],
                    equations_latex: [
                        "MSE = \\frac{1}{n} \\sum_{i=1}^{n} (y_{predicted} - y_{actual})^2"
                    ],
                    student_questions: [],
                    clarifications: []
                },
                {
                    title: "Backpropagation and Learning",
                    concepts: [
                        "Chain rule application",
                        "Gradient descent optimization",
                        "Weight updates through gradients"
                    ],
                    equations_latex: [
                        "w_{new} = w_{old} - \\alpha \\cdot \\frac{\\partial L}{\\partial w}"
                    ],
                    student_questions: [
                        "How do we choose the learning rate?"
                    ],
                    clarifications: [
                        "Learning rate typically ranges from 0.001 to 0.1",
                        "Too high prevents convergence, too low slows training"
                    ]
                }
            ],
            summary: "This lecture covered neural network fundamentals, including perceptrons, activation functions, loss functions, and backpropagation. Key mathematical concepts include the perceptron equation, mean squared error, and gradient descent update rule.",
            key_definitions: [
                "Perceptron: Simplest form of neural network with weighted inputs",
                "Activation Function: Introduces non-linearity to neurons",
                "Loss Function: Measures model performance",
                "Backpropagation: Algorithm for computing gradients using chain rule",
                "Gradient Descent: Optimization algorithm for weight updates"
            ]
        };
    }
}

module.exports = LectureStructuringService;
