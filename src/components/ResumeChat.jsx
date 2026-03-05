import { useState, useRef, useEffect } from 'react';

const QUICK_ACTIONS = [
    '✂️ Make summary shorter',
    '☁️ Emphasize cloud skills',
    '📊 Add more metrics',
    '🎯 Focus on leadership',
    '🔧 Highlight system design',
];

export default function ResumeChat({ chatHistory, onRefine, isRefining }) {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isRefining]);

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed || isRefining) return;
        onRefine(trimmed);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickAction = (action) => {
        if (isRefining) return;
        // Remove emoji prefix for the actual message
        const text = action.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s?/u, '');
        onRefine(text);
    };

    return (
        <div className="resume-chat">
            <div className="chat-header">
                <span className="chat-header-icon">💬</span>
                <h4>Refine Resume</h4>
            </div>

            <div className="chat-messages">
                {chatHistory.length === 0 && !isRefining && (
                    <div className="chat-empty">
                        <p className="chat-empty-text">Tell me how to improve your resume</p>
                        <div className="chat-quick-actions">
                            {QUICK_ACTIONS.map((action) => (
                                <button
                                    key={action}
                                    className="chat-quick-btn"
                                    onClick={() => handleQuickAction(action)}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role}`}>
                        <div className="chat-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isRefining && (
                    <div className="chat-message ai">
                        <div className="chat-bubble">
                            <div className="chat-thinking">
                                <span className="thinking-dot"></span>
                                <span className="thinking-dot"></span>
                                <span className="thinking-dot"></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    placeholder="e.g. Make summary shorter..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isRefining}
                />
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!message.trim() || isRefining}
                    aria-label="Send message"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
