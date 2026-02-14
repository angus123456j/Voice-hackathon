const axios = require('axios');

class VoiceService {
    constructor() {
        this.lightningApiKey = process.env.SMALLEST_LIGHTNING_API_KEY || process.env.SMALLEST_API_KEY;
        this.lightningApiUrl = 'https://waves-api.smallest.ai/api/v1/lightning-v3.1/get_speech';
        this.voiceId = process.env.SMALLEST_VOICE_ID || 'sophia'; // specific voice from cookbook
    }

    async generateVoice(text, streamResponse = false) {
        try {
            console.log('Generating voice with Smallest.ai Lightning v3.1...');

            if (!this.lightningApiKey) {
                console.warn('Smallest.ai Lightning API key not configured, using mock audio');
                return this.getMockAudioUrl();
            }

            const response = await axios.post(
                this.lightningApiUrl,
                {
                    text,
                    voice_id: this.voiceId,
                    sample_rate: 24000,
                    speed: 1.0,
                    language: 'en',
                    output_format: 'mp3',
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.lightningApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                    timeout: 30000,
                }
            );

            // Convert audio buffer to base64 data URL
            const audioBase64 = Buffer.from(response.data).toString('base64');
            console.log('Voice generated successfully with Lightning TTS');
            return `data:audio/mpeg;base64,${audioBase64}`;

        } catch (error) {
            console.error('Voice generation error:', error.message);
            if (error.response) {
                // Buffer to string for error message
                console.error('Error data:', Buffer.from(error.response.data).toString());
            }
            return this.getMockAudioUrl();
        }
    }

    async generateStreamingVoice(text) {
        // Lightning supports streaming with 100ms TTFB
        try {
            console.log('Starting Lightning streaming voice generation...');

            if (!this.lightningApiKey) {
                return this.getMockAudioUrl();
            }

            // For streaming, we'd use the streaming endpoint
            // This is a placeholder - actual implementation would use SSE or WebSocket
            return this.generateVoice(text, true);

        } catch (error) {
            console.error('Streaming voice error:', error.message);
            return this.getMockAudioUrl();
        }
    }

    getMockAudioUrl() {
        // Return a silent audio data URL for demo purposes
        // In production, this would be actual ElevenLabs audio
        const silentMp3Base64 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4T+1n9HAAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
        return `data:audio/mpeg;base64,${silentMp3Base64}`;
    }
}

module.exports = VoiceService;
