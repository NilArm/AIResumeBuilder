import { useState } from 'react';

export default function JDInput({ onGenerate, isLoading }) {
    const [jd, setJd] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jd.trim().length < 50) return;
        onGenerate(jd);
    };

    return (
        <div className="jd-input-panel">
            <div className="panel-header">
                <div className="panel-dot red"></div>
                <div className="panel-dot yellow"></div>
                <div className="panel-dot green"></div>
                <span className="panel-title">job_description.txt</span>
            </div>

            <form onSubmit={handleSubmit} className="jd-form">
                <textarea
                    className="jd-textarea"
                    placeholder="Paste the full job description here...&#10;&#10;Include the role title, company name, required skills, responsibilities, and qualifications for the best results."
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    disabled={isLoading}
                />

                <div className="jd-actions">
                    <div className="jd-char-count">
                        {jd.length > 0 && (
                            <span className={jd.length < 50 ? 'warn' : 'ok'}>
                                {jd.length} chars {jd.length < 50 ? '(min 50)' : '✓'}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`generate-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || jd.trim().length < 50}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Analyzing JD & Tailoring Resume...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                Generate Tailored Resume
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
