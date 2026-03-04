import profile from '../data/profile.json';

// Strip markdown formatting (**, *, etc.) from any text
function clean(text) {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/^#+\s/gm, '').trim();
}

export default function ResumePreview({ data }) {
    const d = data;

    return (
        <div className="resume-preview-panel">
            <div className="panel-header">
                <div className="panel-dot red"></div>
                <div className="panel-dot yellow"></div>
                <div className="panel-dot green"></div>
                <span className="panel-title">tailored_resume.pdf</span>
            </div>

            <div className="resume-document" id="resume-pdf-content">
                {/* Header */}
                <div className="res-header">
                    <h1 className="res-name">{profile.name.toUpperCase()}</h1>
                    <p className="res-title">{clean(d.targetRole)} · {profile.experience_years} Years Experience</p>
                    <div className="res-contact">
                        <span>{profile.phone}</span>
                        <span>{profile.email}</span>
                        <span>{profile.github}</span>
                        <span>{profile.linkedin}</span>
                        <span>{profile.leetcode}</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="res-section">
                    <h2 className="res-section-title">SUMMARY</h2>
                    <p className="res-summary">{clean(d.summary)}</p>
                </div>

                {/* Experience */}
                <div className="res-section">
                    <h2 className="res-section-title">PROFESSIONAL EXPERIENCE</h2>
                    {d.experience.map((exp, i) => (
                        <div key={i} className="res-exp">
                            <div className="res-exp-header">
                                <div>
                                    <strong className="res-exp-role">{clean(exp.role)}</strong>
                                    <p className="res-exp-company">{clean(exp.company)} · {clean(exp.domain)}</p>
                                </div>
                                <span className="res-exp-date">{exp.dates}</span>
                            </div>
                            <ul className="res-bullets">
                                {exp.bullets.map((b, j) => <li key={j}>{clean(b)}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="res-section">
                    <h2 className="res-section-title">PROJECTS</h2>
                    {d.projects.map((proj, i) => (
                        <div key={i} className="res-project">
                            <div className="res-project-header">
                                <strong>{clean(proj.name)}</strong>
                                <span className="res-project-tech">{clean(proj.tech)}</span>
                            </div>
                            <ul className="res-bullets">
                                {proj.bullets.map((b, j) => <li key={j}>{clean(b)}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="res-section">
                    <h2 className="res-section-title">TECHNICAL SKILLS</h2>
                    <div className="res-skills-grid">
                        {Object.entries(d.skills).map(([cat, items]) => (
                            <div key={cat} className="res-skill-row">
                                <span className="res-skill-label">{cat}</span>
                                <span className="res-skill-values">{items.map(s => clean(s)).join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="res-section">
                    <h2 className="res-section-title">CERTIFICATIONS</h2>
                    {profile.certifications.map((c, i) => (
                        <div key={i} className="res-cert-row">
                            <span>{c.name}</span>
                            <span className="res-cert-year">{c.year}</span>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="res-section">
                    <h2 className="res-section-title">EDUCATION</h2>
                    {profile.education.map((e, i) => (
                        <div key={i} className="res-edu">
                            <div className="res-edu-header">
                                <strong>{e.degree}</strong>
                                <span className="res-edu-year">{e.year}</span>
                            </div>
                            <p className="res-edu-college">{e.institution}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
