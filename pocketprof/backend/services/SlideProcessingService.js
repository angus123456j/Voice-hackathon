const fs = require('fs');
const path = require('path');
const { fromBuffer } = require('pdf2pic');
// Removed rimraf since we have fs.rm

class SlideProcessingService {
    async processSlides(fileBuffer, mimeType) {
        try {
            console.log('Processing slides...');

            if (mimeType === 'application/pdf') {
                return await this.processPDF(fileBuffer);
            } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
                // For PPT/PPTX, we'd need additional libraries or conversion services
                console.warn('PPT processing not fully implemented, using mock slides');
                return this.getMockSlides();
            } else {
                throw new Error('Unsupported file type');
            }

        } catch (error) {
            console.error('Slide processing error:', error.message);
            console.warn('Falling back to mock slides');
            return this.getMockSlides();
        }
    }

    async processPDF(pdfBuffer) {
        const tempDir = path.join(__dirname, '../../temp_slides_' + Date.now());

        try {
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });

            }

            const options = {
                density: 100,
                saveFilename: "slide",
                savePath: tempDir,
                format: "png",
                width: 1920,
                height: 1080
            };

            // Initialize pdf2pic with buffer
            const convert = fromBuffer(pdfBuffer, options);

            // Convert all pages (-1) using bulk conversion
            // This returns an array of ResolveResult objects which contain path to saved file
            console.log(`Converting PDF pages using pdf2pic...`);
            const results = await convert.bulk(-1, false);

            console.log(`Converted ${results.length} pages.`);

            const sharp = require('sharp');
            const slides = await Promise.all(results.map(async result => {
                if (result.path) {
                    return await sharp(result.path).toBuffer();
                }
                return null;
            }));
            const filteredSlides = slides.filter(Boolean);

            if (filteredSlides.length === 0) {
                console.warn('No slides extracted from PDF');
                return this.getMockSlides();
            }

            return filteredSlides;

        } catch (error) {
            console.error('PDF conversion error with pdf2pic:', error.message);

            if (error.message.includes('gm') || error.message.includes('gs')) {
                console.error('CRITICAL: GraphicsMagick (gm) or Ghostscript (gs) is missing!');
                console.error('Please verify "sudo apt-get install graphicsmagick ghostscript" is run.');
            }

            console.warn('Falling back to mock slides');
            return this.getMockSlides();
        } finally {
            // Cleanup temporary directory
            try {
                // Use built-in fs.promises.rm (available in Node 14.14+)
                await fs.promises.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error('Failed to cleanup temp slides:', cleanupError.message);
            }
        }
    }

    createMockSlide(slideNumber) {
        // Create a simple SVG buffer representing a slide
        const width = 1920;
        const height = 1080;
        const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1e293b"/>
            <rect x="50" y="50" width="${width - 100}" height="${height - 100}" fill="#334155" rx="10"/>
            <text x="50%" y="45%" text-anchor="middle" font-size="64" fill="#e2e8f0" font-family="Arial, sans-serif">
            Slide ${slideNumber}
            </text>
            <text x="50%" y="55%" text-anchor="middle" font-size="32" fill="#94a3b8" font-family="Arial, sans-serif">
            Lecture Content (Mock)
            </text>
        </svg>
        `;

        return Buffer.from(svg);
    }

    getMockSlides() {
        // Return 5 mock slides
        return [
            this.createMockSlide(1),
            this.createMockSlide(2),
            this.createMockSlide(3),
            this.createMockSlide(4),
            this.createMockSlide(5),
        ];
    }
}

module.exports = SlideProcessingService;
