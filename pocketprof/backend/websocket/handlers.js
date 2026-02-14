function setupWebSocketHandlers(wss, services) {
    const { tutorService, voiceService, computerUseService, sessionManager } = services;

    wss.on('connection', (ws) => {
        console.log('[BACKEND] New client connection established');
        let sessionId = null;
        let isAlive = true;

        ws.on('pong', () => {
            isAlive = true;
        });

        const interval = setInterval(() => {
            if (isAlive === false) return ws.terminate();
            isAlive = false;
            ws.ping();
        }, 30000);

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('Received WebSocket message:', message.type);

                switch (message.type) {
                    case 'start_tutor':
                        await handleStartTutor(ws, message, tutorService, voiceService);
                        break;

                    case 'question':
                        await handleQuestion(ws, message, tutorService, voiceService, sessionId);
                        break;

                    case 'interrupt':
                        await handleInterrupt(ws);
                        break;

                    case 'navigate_slide':
                        await handleNavigateSlide(ws, message, computerUseService);
                        break;

                    case 'set_session':
                        sessionId = message.sessionId;
                        break;

                    default:
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Unknown message type',
                        }));
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: error.message,
                }));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'connected',
            message: 'Connected to ProfReplay AI',
        }));
    });
}

async function handleStartTutor(ws, message, tutorService, voiceService) {
    try {
        const { knowledge, slideCount } = message;
        const sessionId = Date.now().toString();

        // Initialize tutor
        await tutorService.initializeTutor(sessionId, knowledge, slideCount);

        // Generate opening narration
        const narration = await tutorService.generateNarration(sessionId, knowledge, 0);

        // Generate voice
        const audioUrl = await voiceService.generateVoice(narration.speech);

        // Send response
        ws.send(JSON.stringify({
            type: 'tutor_started',
            sessionId,
            narration: narration.speech,
            audioUrl,
            navigate_to_slide: narration.navigate_to_slide,
        }));

        // If there's slide navigation
        if (narration.navigate_to_slide !== undefined) {
            ws.send(JSON.stringify({
                type: 'navigate_slide',
                slideIndex: narration.navigate_to_slide,
            }));
        }
    } catch (error) {
        console.error('Start tutor error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to start tutor',
        }));
    }
}

async function handleQuestion(ws, message, tutorService, voiceService, sessionId) {
    try {
        const { question, knowledge, currentSlide } = message;

        // Get answer from tutor
        const answer = await tutorService.answerQuestion(
            sessionId || Date.now().toString(),
            question,
            knowledge,
            currentSlide
        );

        // Generate voice
        const audioUrl = await voiceService.generateVoice(answer.speech);

        // Send response
        ws.send(JSON.stringify({
            type: 'tutor_response',
            question,
            answer: answer.speech,
            audioUrl,
            navigate_to_slide: answer.navigate_to_slide,
        }));

        // If there's slide navigation
        if (answer.navigate_to_slide !== undefined) {
            ws.send(JSON.stringify({
                type: 'navigate_slide',
                slideIndex: answer.navigate_to_slide,
            }));
        }
    } catch (error) {
        console.error('Question handling error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to answer question',
        }));
    }
}

async function handleInterrupt(ws) {
    ws.send(JSON.stringify({
        type: 'interrupted',
        message: 'Audio playback interrupted',
    }));
}

async function handleNavigateSlide(ws, message, computerUseService) {
    try {
        const result = await computerUseService.executeComputerAction({
            type: 'navigate_slide',
            slideIndex: message.slideIndex,
        });

        ws.send(JSON.stringify({
            type: 'slide_navigated',
            slideIndex: message.slideIndex,
            result,
        }));
    } catch (error) {
        console.error('Slide navigation error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to navigate slide',
        }));
    }
}

module.exports = setupWebSocketHandlers;
