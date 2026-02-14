class SessionManager {
    constructor() {
        this.sessions = new Map();
    }

    createSession(sessionId, data) {
        this.sessions.set(sessionId, {
            ...data,
            createdAt: new Date(),
            lastAccessed: new Date(),
        });
        console.log(`Session created: ${sessionId}`);
    }

    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastAccessed = new Date();
        }
        return session;
    }

    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (session) {
            Object.assign(session, updates);
            session.lastAccessed = new Date();
        }
    }

    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
        console.log(`Session deleted: ${sessionId}`);
    }

    // Clean up old sessions (older than 24 hours)
    cleanupOldSessions() {
        const now = new Date();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        for (const [sessionId, session] of this.sessions.entries()) {
            const age = now - session.lastAccessed;
            if (age > maxAge) {
                this.deleteSession(sessionId);
            }
        }
    }

    getAllSessions() {
        return Array.from(this.sessions.keys());
    }
}

// Singleton instance
const sessionManager = new SessionManager();

// Run cleanup every hour
setInterval(() => {
    sessionManager.cleanupOldSessions();
}, 60 * 60 * 1000);

module.exports = sessionManager;
