const { GoogleGenerativeAI } = require('@google/generative-ai');

class ComputerUseService {
    constructor() {
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.enabled = !!this.geminiApiKey;

        if (this.enabled) {
            this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        }
    }

    async executeComputerAction(action, context = {}) {
        try {
            if (!this.enabled) {
                console.warn('Computer Use not enabled, skipping action:', action);
                return { success: false, message: 'Computer Use not configured' };
            }

            console.log('Executing Computer Use action:', action);

            switch (action.type) {
                case 'navigate_slide':
                    return this.navigateSlide(action.slideIndex, context);

                case 'automate_demo':
                    return this.automateDemo(context);

                case 'analyze_slide':
                    return this.analyzeSlide(action.slideIndex, context);

                default:
                    return { success: false, message: 'Unknown action type' };
            }

        } catch (error) {
            console.error('Computer Use error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async navigateSlide(slideIndex, context) {
        return {
            success: true,
            action: 'navigate',
            slideIndex,
            message: `Navigated to slide ${slideIndex}`,
        };
    }

    async automateDemo(context) {
        const steps = [
            { action: 'navigate_slide', slideIndex: 0, delay: 2000 },
            { action: 'narrate', text: 'Starting lecture overview...' },
            { action: 'navigate_slide', slideIndex: 1, delay: 3000 },
            { action: 'narrate', text: 'Explaining key concepts...' },
        ];

        return {
            success: true,
            automation: steps,
            message: 'Demo automation sequence prepared',
        };
    }

    async analyzeSlide(slideIndex, context) {
        if (!context.slideImage) {
            return { success: false, message: 'No slide image provided' };
        }

        try {
            // Convert base64 image data to Gemini format
            const imageData = context.slideImage.split(',')[1] || context.slideImage;

            const result = await this.model.generateContent([
                "Analyze this lecture slide and extract key information including title, main points, and any equations or diagrams.",
                {
                    inlineData: {
                        data: imageData,
                        mimeType: "image/png"
                    }
                }
            ]);

            return {
                success: true,
                analysis: result.response.text(),
            };

        } catch (error) {
            console.error('Slide analysis error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async enhanceWithComputerVision(slides) {
        return slides;
    }
}

module.exports = ComputerUseService;
