const axios = require('axios');

class AudioProcessingService {
    constructor() {
        this.pulseApiKey = process.env.SMALLEST_PULSE_API_KEY;
        this.pulseApiUrl = 'https://waves-api.smallest.ai/api/v1/pulse/get_text';
    }

    async processAudio(audioBuffer) {
        try {
            console.log('Sending audio to Smallest.ai Pulse for transcription...');

            if (!this.pulseApiKey) {
                console.warn('Smallest Pulse API key not configured, using mock transcript');
                return this.getMockTranscript();
            }

            const response = await axios.post(
                this.pulseApiUrl,
                audioBuffer,
                {
                    headers: {
                        'Authorization': `Bearer ${this.pulseApiKey}`,
                        'Content-Type': 'application/octet-stream',
                    },
                    params: {
                        language: 'en',
                        diarize: 'true',
                        word_timestamps: 'true',
                    },
                }
            );

            let transcript = '';
            if (response.data.utterances && response.data.utterances.length > 0) {
                // Combine diarized utterances with speaker labels
                transcript = response.data.utterances.map(utt => {
                    const speaker = utt.speaker !== undefined ? `Speaker ${utt.speaker}` : 'Speaker';
                    return `${speaker}: ${utt.text}`;
                }).join('\n');
            } else {
                transcript = response.data.transcription || response.data.text || response.data.transcript;
            }

            console.log('Transcription completed with diarization');

            return transcript;

        } catch (error) {
            console.error('Transcription error:', error.message);
            console.warn('Falling back to mock transcript');
            return this.getMockTranscript();
        }
    }

    getMockTranscript() {
        return `Welcome to today's lecture on Machine Learning Fundamentals. 
    
Today we'll be covering the basics of neural networks and how they learn from data. 
Let's start with the concept of a perceptron, which is the simplest form of a neural network.

A perceptron takes multiple inputs, applies weights to them, and produces an output. 
The mathematical formula is: y = sigma(w1*x1 + w2*x2 + ... + wn*xn + b), where sigma is the activation function.

Student question: "Professor, what's the difference between the activation function and the loss function?"

Great question! The activation function is applied to each neuron to introduce non-linearity, 
while the loss function measures how well our model is performing. Common loss functions include 
mean squared error for regression: MSE = (1/n) * sum((y_predicted - y_actual)^2).

Now let's move to backpropagation, which is how neural networks learn. The key insight is using 
the chain rule from calculus to compute gradients. The gradient descent update rule is: 
w_new = w_old - learning_rate * gradient.

Student question: "How do we choose the learning rate?"

Excellent question! The learning rate is typically chosen through experimentation. Common values 
range from 0.001 to 0.1. Too high and the model won't converge, too low and training takes forever.

In summary, neural networks learn by adjusting weights through backpropagation, using activation 
functions for non-linearity and loss functions to measure performance.`;
    }
}

module.exports = AudioProcessingService;
