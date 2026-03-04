import { useState } from 'react';

export default function PrepGuide({ data, isLoading }) {
    const [expandedTopic, setExpandedTopic] = useState(null);

    if (isLoading) {
        return (
            <div className="prep-loading">
                <div className="prep-loading-spinner"></div>
                <h3>Generating your prep guide...</h3>
                <p>Analyzing JD requirements and building a study plan</p>
            </div>
        );
    }

    if (!data) return null;

    const toggleTopic = (key) => {
        setExpandedTopic(expandedTopic === key ? null : key);
    };

    const getPriorityColor = (p) => {
        if (p === 'high') return '#ff6b6b';
        if (p === 'medium') return '#ffd93d';
        return '#00d4aa';
    };

    const getDifficultyIcon = (d) => {
        if (d === 'advanced') return '🔴';
        if (d === 'intermediate') return '🟡';
        return '🟢';
    };

    return (
        <div className="prep-guide">
            {/* Header Summary */}
            <div className="prep-header-card">
                <div className="prep-header-top">
                    <h3>📚 Interview Prep Guide</h3>
                    <div className="prep-total-hours">
                        <span className="prep-hours-num">{data.totalPrepHours}</span>
                        <span className="prep-hours-label">hours est.</span>
                    </div>
                </div>
                <p className="prep-role-summary">{data.roleSummary}</p>
            </div>

            {/* Topics to Learn */}
            {data.topicsToLearn && data.topicsToLearn.length > 0 && (
                <div className="prep-section">
                    <h4 className="prep-section-title">
                        <span className="prep-section-icon">🎓</span>
                        Topics to Learn
                        <span className="prep-section-count">{data.topicsToLearn.length}</span>
                    </h4>
                    {data.topicsToLearn.map((t, i) => {
                        const key = `learn-${i}`;
                        const isOpen = expandedTopic === key;
                        return (
                            <div key={key} className={`prep-topic-card ${isOpen ? 'expanded' : ''}`}>
                                <div className="prep-topic-header" onClick={() => toggleTopic(key)}>
                                    <div className="prep-topic-main">
                                        <span className="prep-topic-name">{t.topic}</span>
                                        <div className="prep-topic-badges">
                                            <span className="prep-badge" style={{ color: getPriorityColor(t.priority) }}>
                                                {t.priority}
                                            </span>
                                            <span className="prep-badge">{getDifficultyIcon(t.difficulty)} {t.difficulty}</span>
                                            <span className="prep-badge">⏱ {t.estimatedHours}h</span>
                                        </div>
                                    </div>
                                    <span className={`prep-chevron ${isOpen ? 'open' : ''}`}>▸</span>
                                </div>
                                {isOpen && (
                                    <div className="prep-topic-body">
                                        <p className="prep-why">{t.whyNeeded}</p>
                                        <div className="prep-subtopics">
                                            <h5>Subtopics to cover:</h5>
                                            <ul>
                                                {t.subtopics.map((s, j) => <li key={j}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div className="prep-questions">
                                            <h5>💬 Interview Questions:</h5>
                                            <ol>
                                                {t.interviewQuestions.map((q, j) => <li key={j}>{q}</li>)}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Topics to Revise */}
            {data.topicsToRevise && data.topicsToRevise.length > 0 && (
                <div className="prep-section">
                    <h4 className="prep-section-title">
                        <span className="prep-section-icon">🔄</span>
                        Topics to Revise
                        <span className="prep-section-count">{data.topicsToRevise.length}</span>
                    </h4>
                    {data.topicsToRevise.map((t, i) => {
                        const key = `revise-${i}`;
                        const isOpen = expandedTopic === key;
                        return (
                            <div key={key} className={`prep-topic-card revise ${isOpen ? 'expanded' : ''}`}>
                                <div className="prep-topic-header" onClick={() => toggleTopic(key)}>
                                    <div className="prep-topic-main">
                                        <span className="prep-topic-name">{t.topic}</span>
                                        <div className="prep-topic-badges">
                                            <span className="prep-badge" style={{ color: getPriorityColor(t.priority) }}>
                                                {t.priority}
                                            </span>
                                            <span className="prep-badge">{getDifficultyIcon(t.difficulty)} {t.difficulty}</span>
                                            <span className="prep-badge">⏱ {t.estimatedHours}h</span>
                                        </div>
                                    </div>
                                    <span className={`prep-chevron ${isOpen ? 'open' : ''}`}>▸</span>
                                </div>
                                {isOpen && (
                                    <div className="prep-topic-body">
                                        <p className="prep-why">{t.focusAreas}</p>
                                        <div className="prep-subtopics">
                                            <h5>Key areas to brush up:</h5>
                                            <ul>
                                                {t.subtopics.map((s, j) => <li key={j}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div className="prep-questions">
                                            <h5>💬 Interview Questions:</h5>
                                            <ol>
                                                {t.interviewQuestions.map((q, j) => <li key={j}>{q}</li>)}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* System Design */}
            {data.systemDesignTopics && data.systemDesignTopics.length > 0 && (
                <div className="prep-section">
                    <h4 className="prep-section-title">
                        <span className="prep-section-icon">🏗️</span>
                        System Design Topics
                    </h4>
                    {data.systemDesignTopics.map((t, i) => (
                        <div key={i} className="prep-design-card">
                            <strong>{t.topic}</strong>
                            <p className="prep-design-relevance">{t.relevance}</p>
                            <div className="prep-design-components">
                                {t.keyComponents.map((c, j) => (
                                    <span key={j} className="prep-component-tag">{c}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Behavioral Tips */}
            {data.behavioralTips && data.behavioralTips.length > 0 && (
                <div className="prep-section">
                    <h4 className="prep-section-title">
                        <span className="prep-section-icon">🎯</span>
                        Behavioral Interview Tips
                    </h4>
                    <div className="prep-tips">
                        {data.behavioralTips.map((tip, i) => (
                            <div key={i} className="prep-tip">{tip}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
