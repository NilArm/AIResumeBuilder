import { useState } from 'react';
import JDInput from './components/JDInput';
import ResumePreview from './components/ResumePreview';
import MatchInsights from './components/MatchInsights';
import PrepGuide from './components/PrepGuide';
import { generateTailoredResume, regenerateWithSkills, generatePrepGuide } from './services/aiService';
import { exportToPdf } from './utils/pdfExport';

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [currentJD, setCurrentJD] = useState('');
  const [view, setView] = useState('input'); // 'input' | 'result'
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'prep'
  const [prepData, setPrepData] = useState(null);
  const [isPrepLoading, setIsPrepLoading] = useState(false);

  const handleGenerate = async (jd) => {
    setIsLoading(true);
    setError(null);
    setPrepData(null);
    setActiveTab('resume');
    try {
      const data = await generateTailoredResume(jd);
      setResult(data);
      setCurrentJD(jd);
      setView('result');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    const filename = result
      ? `Nilesh_Armal_${result.targetCompany.replace(/\s+/g, '_')}.pdf`
      : 'Nilesh_Armal_Resume.pdf';
    exportToPdf('resume-pdf-content', filename);
  };

  const handleBack = () => {
    setView('input');
    setPrepData(null);
    setActiveTab('resume');
  };

  const handleRegenerate = async (confirmedSkills) => {
    setIsRegenerating(true);
    try {
      const data = await regenerateWithSkills(currentJD, confirmedSkills);
      setResult(data);
      setPrepData(null); // reset prep since skills changed
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handlePrepTab = async () => {
    setActiveTab('prep');
    if (!prepData) {
      setIsPrepLoading(true);
      try {
        const allMissing = [
          ...(result.missingSkills || []),
          ...(result.suggestedSkills || []).map(s => s.skill)
        ];
        const data = await generatePrepGuide(currentJD, result.matchedSkills, allMissing);
        setPrepData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsPrepLoading(false);
      }
    }
  };

  return (
    <div className="app">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">⚡</span>
          <h1 className="topbar-title">ResumeAI</h1>
          <span className="topbar-badge">by Nilesh</span>
        </div>
        <div className="topbar-right">
          {view === 'result' && (
            <>
              <button className="topbar-btn secondary" onClick={handleBack}>
                ← New JD
              </button>
              {activeTab === 'resume' && (
                <button className="topbar-btn primary" onClick={handleExportPdf}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export PDF
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {view === 'input' ? (
          <div className="input-view">
            <div className="input-hero">
              <h2>Paste a Job Description</h2>
              <p>AI will analyze the JD and create a tailored resume with matched keywords, reordered bullets, and an optimized summary.</p>
            </div>
            <JDInput onGenerate={handleGenerate} isLoading={isLoading} />
            {error && (
              <div className="error-banner">
                <span>❌</span> {error}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="result-tabs">
              <button
                className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => setActiveTab('resume')}
              >
                📄 Resume
              </button>
              <button
                className={`tab-btn ${activeTab === 'prep' ? 'active' : ''}`}
                onClick={handlePrepTab}
              >
                📚 Prep Guide
              </button>
            </div>

            {activeTab === 'resume' ? (
              <div className="result-view">
                <div className="result-sidebar">
                  <MatchInsights data={result} onRegenerate={handleRegenerate} isRegenerating={isRegenerating} />
                </div>
                <div className="result-main" style={{ position: 'relative' }}>
                  {isRegenerating && (
                    <div className="regen-overlay">
                      <div className="regen-overlay-content">
                        <div className="spinner" style={{ width: 36, height: 36 }}></div>
                        <p>Regenerating resume with your skills...</p>
                      </div>
                    </div>
                  )}
                  <ResumePreview data={result} />
                </div>
              </div>
            ) : (
              <div className="prep-view">
                <PrepGuide data={prepData} isLoading={isPrepLoading} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
