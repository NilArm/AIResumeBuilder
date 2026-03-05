import { GoogleGenerativeAI } from '@google/generative-ai';
import profile from '../data/profile.json';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert resume writer and ATS optimization specialist. Your task is to tailor a candidate's resume to match a specific job description.

RULES:
1. ONLY use information from the candidate's actual profile — NEVER fabricate skills, experiences, or metrics.
2. Rewrite the summary to target the specific role while keeping all claims truthful.
3. Reorder experience bullets to put the most relevant ones first.
4. Rephrase bullets to naturally incorporate keywords from the JD, but only where truthful.
5. Select the most relevant projects and skills for this role.
6. If the JD mentions skills the candidate doesn't have, DO NOT add them. Instead, highlight transferable skills.
7. Keep the resume concise — max 6 experience bullets, 4 project bullets each.
8. Use strong action verbs and quantified achievements.
9. For "missingSkills", include skills from the JD that the candidate does NOT have in their profile AND that were NOT confirmed by the user. Also add a "suggestedSkills" array with skills from the JD that the candidate might know but aren't in their profile — phrase each as a question.
10. NEVER use markdown formatting like **bold**, *italic*, or any other markup in the text content. All text must be plain text only — no **, no *, no #, no backticks.

OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "targetRole": "The role title from the JD",
  "targetCompany": "The company name from the JD (or 'Unknown' if not found)",
  "matchScore": 85,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestedSkills": [
    {"skill": "Kafka", "question": "Have you worked with Kafka or similar event streaming platforms?"},
    {"skill": "gRPC", "question": "Do you have experience with gRPC for inter-service communication?"}
  ],
  "summary": "Tailored summary paragraph",
  "experience": [
    {
      "role": "Role title",
      "company": "Company name",
      "domain": "Domain",
      "dates": "Date range",
      "bullets": ["bullet1", "bullet2"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "tech": "Tech stack",
      "bullets": ["bullet1", "bullet2"]
    }
  ],
  "skills": {
    "Category": ["skill1", "skill2"]
  },
  "keywords_added": ["keyword1", "keyword2"]
}`;

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

export async function generateTailoredResume(jobDescription) {
  const prompt = `${SYSTEM_PROMPT}

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Generate the tailored resume JSON now:`;

  return callGemini(prompt);
}

export async function regenerateWithSkills(jobDescription, confirmedSkills) {
  const prompt = `${SYSTEM_PROMPT}

ADDITIONAL CONTEXT:
The candidate has CONFIRMED they have experience with these additional skills that were not in their original profile: ${confirmedSkills.join(', ')}.
You MUST now treat these as real skills the candidate has. Include them naturally in the resume — add them to the skills section, and weave them into experience bullets where appropriate. The match score should improve.
Do NOT list these confirmed skills in "missingSkills" anymore — they are now matched.

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Generate the tailored resume JSON now:`;

  return callGemini(prompt);
}

export async function generatePrepGuide(jobDescription, matchedSkills, missingSkills) {
  const prompt = `You are a senior technical interview coach. Based on the job description and the candidate's skill analysis, generate a comprehensive interview preparation guide.

The candidate has these MATCHED skills: ${matchedSkills.join(', ')}
The candidate is MISSING these skills: ${missingSkills.join(', ')}

For matched skills, they need to REVISE (brush up for interviews).
For missing skills, they need to LEARN from scratch.

For EACH topic, provide:
- Key subtopics to cover
- Difficulty level (beginner/intermediate/advanced)
- Estimated hours to prepare
- 2-3 specific interview questions they might be asked

OUTPUT FORMAT:
Return ONLY a valid JSON object (no markdown, no code fences):
{
  "roleSummary": "Brief description of what the role requires",
  "totalPrepHours": 40,
  "topicsToLearn": [
    {
      "topic": "Kafka",
      "priority": "high",
      "difficulty": "intermediate",
      "estimatedHours": 8,
      "subtopics": ["Topic Architecture", "Producers & Consumers", "Partitioning"],
      "whyNeeded": "Brief explanation of why this is needed for the role",
      "interviewQuestions": ["Q1?", "Q2?", "Q3?"]
    }
  ],
  "topicsToRevise": [
    {
      "topic": "Spring Boot",
      "priority": "high",
      "difficulty": "advanced",
      "estimatedHours": 4,
      "subtopics": ["Auto-configuration", "Actuator", "Security"],
      "focusAreas": "What to specifically focus on for this role",
      "interviewQuestions": ["Q1?", "Q2?", "Q3?"]
    }
  ],
  "systemDesignTopics": [
    {
      "topic": "Design an Order Management System",
      "relevance": "Directly relevant to the role",
      "keyComponents": ["Component1", "Component2", "Component3"]
    }
  ],
  "behavioralTips": ["Tip1", "Tip2", "Tip3"]
}

JOB DESCRIPTION:
${jobDescription}

Generate the prep guide JSON now:`;

  return callGemini(prompt);
}

export async function refineResumeWithChat(currentResume, jobDescription, chatHistory) {
  const conversationContext = chatHistory
    .map(msg => `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.content}`)
    .join('\n');

  const prompt = `You are an expert resume writer and ATS optimization specialist. The user has already generated a tailored resume and is now refining it through a conversation.

RULES:
1. ONLY use information from the candidate's actual profile — NEVER fabricate skills, experiences, or metrics.
2. Apply the user's requested changes to the resume while keeping all claims truthful.
3. Maintain the same JSON structure as the original resume.
4. NEVER use markdown formatting like **bold**, *italic*, or any other markup in the text content. All text must be plain text only.
5. Include a "chatResponse" field with a brief, friendly confirmation of what you changed (1-2 sentences max).

CURRENT RESUME:
${JSON.stringify(currentResume, null, 2)}

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

CONVERSATION HISTORY:
${conversationContext}

Apply the user's latest request and return the FULL updated resume JSON with the same structure as before, plus a "chatResponse" field describing what changed. Return ONLY valid JSON (no markdown, no code fences).`;

  return callGemini(prompt);
}
