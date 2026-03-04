import { useState } from 'react';

export default function MatchInsights({ data, onRegenerate, isRegenerating }) {
    const [confirmedSkills, setConfirmedSkills] = useState([]);

    const suggestedSkills = data.suggestedSkills || [];
    const hasConfirmed = confirmedSkills.length > 0;

    const toggleSkill = (skill) => {
        setConfirmedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleRegenerate = () => {
        if (confirmedSkills.length > 0) {
            onRegenerate(confirmedSkills);
            setConfirmedSkills([]);
        }
    };

    return (
        <div className="match-insights">
            <div className="match-header">
                <div className="match-score-circle">
                    <svg viewBox="0 0 36 36" className="match-score-svg">
                        <path
                            className="match-score-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="match-score-fg"
                            strokeDasharray={`${data.matchScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <span className="match-score-text">{data.matchScore}%</span>
                </div>
                <div className="match-meta">
                    <h3 className="match-role">{data.targetRole}</h3>
                    <p className="match-company">{data.targetCompany}</p>
                </div>
            </div>

            <div className="match-tags">
                {/* Matched Skills */}
                <div className="match-tag-group">
                    <h4>✅ Matched Skills</h4>
                    <div className="tag-list">
                        {data.matchedSkills.map((s) => (
                            <span key={s} className="tag matched">{s}</span>
                        ))}
                    </div>
                </div>

                {/* Suggested Skills — interactive checkboxes */}
                {suggestedSkills.length > 0 && (
                    <div className="match-tag-group suggested-group">
                        <h4>💡 Do you know these skills?</h4>
                        <p className="suggested-hint">Select skills you have experience with to boost your match</p>
                        <div className="suggested-list">
                            {suggestedSkills.map((item) => {
                                const isChecked = confirmedSkills.includes(item.skill);
                                return (
                                    <label key={item.skill} className={`suggested-item ${isChecked ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSkill(item.skill)}
                                            disabled={isRegenerating}
                                        />
                                        <div className="suggested-content">
                                            <span className="suggested-skill-name">{item.skill}</span>
                                            <span className="suggested-question">{item.question}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {hasConfirmed && (
                            <button
                                className={`regenerate-btn ${isRegenerating ? 'loading' : ''}`}
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                            >
                                {isRegenerating ? (
                                    <>
                                        <span className="spinner"></span>
                                        Regenerating...
                                    </>
                                ) : (
                                    <>
                                        🔄 Regenerate with {confirmedSkills.length} skill{confirmedSkills.length > 1 ? 's' : ''}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Missing Skills */}
                {data.missingSkills && data.missingSkills.length > 0 && (
                    <div className="match-tag-group">
                        <h4>⚠️ Missing Skills</h4>
                        <div className="tag-list">
                            {data.missingSkills.map((s) => (
                                <span key={s} className="tag missing">{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Keywords Added */}
                {data.keywords_added && data.keywords_added.length > 0 && (
                    <div className="match-tag-group">
                        <h4>🔑 Keywords Added</h4>
                        <div className="tag-list">
                            {data.keywords_added.map((k) => (
                                <span key={k} className="tag keyword">{k}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
