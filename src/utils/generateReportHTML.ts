interface InterviewResponse {
  question: string;
  answer: string;
  feedback?: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

interface FinalReport {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const getScoreGradient = (score: number): string => {
  if (score >= 80) return "linear-gradient(135deg, #22c55e, #16a34a)";
  if (score >= 60) return "linear-gradient(135deg, #f59e0b, #d97706)";
  return "linear-gradient(135deg, #ef4444, #dc2626)";
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
};

const generateCircularProgress = (score: number, label: string, color: string, size: number = 120): string => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return `
    <div style="text-align: center; margin: 15px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="10"
        />
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 ${size / 2} ${size / 2})"
          style="transition: stroke-dashoffset 0.5s ease;"
        />
        <text
          x="${size / 2}"
          y="${size / 2}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="28"
          font-weight="bold"
          fill="${color}"
        >${score}</text>
      </svg>
      <p style="margin-top: 8px; font-size: 14px; color: #6b7280; font-weight: 500;">${label}</p>
    </div>
  `;
};

const generateBarChart = (responses: InterviewResponse[]): string => {
  const maxHeight = 150;
  const barWidth = 50;
  const gap = 20;
  const totalWidth = responses.length * (barWidth + gap);
  
  const bars = responses.map((r, i) => {
    const score = r.feedback?.score || 0;
    const height = (score / 100) * maxHeight;
    const x = i * (barWidth + gap) + gap;
    const color = getScoreColor(score);
    
    return `
      <g>
        <rect
          x="${x}"
          y="${maxHeight - height + 30}"
          width="${barWidth}"
          height="${height}"
          fill="${color}"
          rx="4"
        />
        <text
          x="${x + barWidth / 2}"
          y="${maxHeight + 50}"
          text-anchor="middle"
          font-size="12"
          fill="#6b7280"
        >Q${i + 1}</text>
        <text
          x="${x + barWidth / 2}"
          y="${maxHeight - height + 20}"
          text-anchor="middle"
          font-size="12"
          font-weight="bold"
          fill="${color}"
        >${score}</text>
      </g>
    `;
  }).join("");

  return `
    <svg width="100%" height="220" viewBox="0 0 ${Math.max(totalWidth + 40, 400)} 220" preserveAspectRatio="xMidYMid meet">
      <line x1="20" y1="180" x2="${totalWidth + 20}" y2="180" stroke="#e5e7eb" stroke-width="2"/>
      ${bars}
    </svg>
  `;
};

const generateRadarChart = (report: FinalReport): string => {
  const skills = [
    { name: "Communication", score: report.communicationScore },
    { name: "Confidence", score: report.confidenceScore },
    { name: "Technical", score: report.technicalScore },
    { name: "Overall", score: report.overallScore },
  ];
  
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const angleStep = (2 * Math.PI) / skills.length;
  
  // Grid lines
  const gridLines = [20, 40, 60, 80, 100].map(level => {
    const radius = (level / 100) * maxRadius;
    const points = skills.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
    }).join(" ");
    return `<polygon points="${points}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`;
  }).join("");
  
  // Axis lines
  const axisLines = skills.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x2 = centerX + maxRadius * Math.cos(angle);
    const y2 = centerY + maxRadius * Math.sin(angle);
    return `<line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}" stroke="#e5e7eb" stroke-width="1"/>`;
  }).join("");
  
  // Data polygon
  const dataPoints = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const radius = (skill.score / 100) * maxRadius;
    return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
  }).join(" ");
  
  // Labels
  const labels = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#6b7280" font-weight="500">${skill.name}</text>`;
  }).join("");
  
  return `
    <svg width="300" height="300" viewBox="0 0 300 300">
      ${gridLines}
      ${axisLines}
      <polygon points="${dataPoints}" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" stroke-width="2"/>
      ${labels}
    </svg>
  `;
};

export const generateReportHTML = (
  report: FinalReport,
  responses: InterviewResponse[],
  interviewType: string
): string => {
  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scoreCards = [
    { label: "Overall", score: report.overallScore, icon: "🏆" },
    { label: "Communication", score: report.communicationScore, icon: "💬" },
    { label: "Confidence", score: report.confidenceScore, icon: "📈" },
    { label: "Technical", score: report.technicalScore, icon: "🧠" },
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Report - ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #1f2937;
      line-height: 1.6;
      padding: 40px 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.3; }
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      margin-top: 15px;
      backdrop-filter: blur(10px);
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-title span {
      font-size: 24px;
    }
    
    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    
    @media (max-width: 768px) {
      .score-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .score-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .score-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .score-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .score-value {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .score-label {
      font-size: 13px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .score-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 8px;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    
    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .chart-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }
    
    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .circular-scores {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .summary-box {
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      border: 1px solid #e9d5ff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
    }
    
    .summary-box p {
      font-size: 15px;
      color: #6b21a8;
      line-height: 1.7;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      .two-column {
        grid-template-columns: 1fr;
      }
    }
    
    .list-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }
    
    .list-card.strengths {
      border-left: 4px solid #22c55e;
    }
    
    .list-card.improvements {
      border-left: 4px solid #f59e0b;
    }
    
    .list-card h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .list-card ul {
      list-style: none;
    }
    
    .list-card li {
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .list-card li:last-child {
      border-bottom: none;
    }
    
    .list-card li::before {
      font-size: 16px;
    }
    
    .list-card.strengths li::before {
      content: '✓';
      color: #22c55e;
      font-weight: bold;
    }
    
    .list-card.improvements li::before {
      content: '→';
      color: #f59e0b;
      font-weight: bold;
    }
    
    .recommendations {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #93c5fd;
      border-radius: 16px;
      padding: 24px;
      margin-top: 30px;
    }
    
    .recommendations h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .recommendation-item {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .recommendation-item:last-child {
      margin-bottom: 0;
    }
    
    .rec-number {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .rec-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }
    
    .response-section {
      margin-top: 40px;
    }
    
    .response-item {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
    }
    
    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .question-number {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .response-score {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .question-text {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    
    .answer-text {
      font-size: 14px;
      color: #6b7280;
      background: white;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      line-height: 1.7;
    }
    
    .feedback-text {
      font-size: 13px;
      color: #6b21a8;
      background: #faf5ff;
      padding: 12px 16px;
      border-radius: 10px;
      margin-top: 12px;
      border-left: 3px solid #a855f7;
    }
    
    .footer {
      background: #1f2937;
      color: white;
      padding: 30px 40px;
      text-align: center;
    }
    
    .footer p {
      font-size: 14px;
      opacity: 0.8;
    }
    
    .footer .brand {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <div class="logo">🎯</div>
        <h1>AI Interview Report</h1>
        <p>Your performance analysis and personalized feedback</p>
        <div class="badge">${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview • ${date}</div>
      </div>
    </div>
    
    <div class="content">
      <!-- Overall Score Highlight -->
      <div class="section">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; padding: 30px 50px; background: ${getScoreGradient(report.overallScore)}; border-radius: 20px; color: white;">
            <div style="font-size: 64px; font-weight: 700;">${report.overallScore}</div>
            <div style="font-size: 18px; font-weight: 500; opacity: 0.9;">Overall Score</div>
            <div style="font-size: 14px; margin-top: 8px; padding: 4px 16px; background: rgba(255,255,255,0.2); border-radius: 12px;">${getScoreLabel(report.overallScore)}</div>
          </div>
        </div>
      </div>
      
      <!-- Score Cards -->
      <div class="score-grid">
        ${scoreCards.map(card => `
          <div class="score-card">
            <div class="score-icon">${card.icon}</div>
            <div class="score-value" style="color: ${getScoreColor(card.score)}">${card.score}</div>
            <div class="score-label">${card.label}</div>
          </div>
        `).join("")}
      </div>
      
      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-title">📊 Skills Radar</div>
          <div style="display: flex; justify-content: center;">
            ${generateRadarChart(report)}
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-title">📈 Question Performance</div>
          ${generateBarChart(responses)}
        </div>
      </div>
      
      <!-- Summary -->
      <div class="section">
        <div class="section-title"><span>📝</span> Summary</div>
        <div class="summary-box">
          <p>${report.summary}</p>
        </div>
      </div>
      
      <!-- Strengths & Improvements -->
      <div class="section">
        <div class="two-column">
          <div class="list-card strengths">
            <h4><span>✨</span> Your Strengths</h4>
            <ul>
              ${report.strengths.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>
          <div class="list-card improvements">
            <h4><span>🎯</span> Areas to Improve</h4>
            <ul>
              ${report.improvements.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="recommendations">
        <h4><span>💡</span> Personalized Recommendations</h4>
        ${report.recommendations.map((rec, i) => `
          <div class="recommendation-item">
            <div class="rec-number">${i + 1}</div>
            <div class="rec-text">${rec}</div>
          </div>
        `).join("")}
      </div>
      
      <!-- Response Details -->
      <div class="response-section">
        <div class="section-title"><span>💬</span> Your Responses</div>
        ${responses.map((r, i) => `
          <div class="response-item">
            <div class="response-header">
              <span class="question-number">Question ${i + 1}</span>
              ${r.feedback ? `
                <span class="response-score" style="background: ${getScoreColor(r.feedback.score)}20; color: ${getScoreColor(r.feedback.score)}">
                  Score: ${r.feedback.score}/100
                </span>
              ` : ""}
            </div>
            <div class="question-text">${r.question}</div>
            <div class="answer-text">${r.answer === "[Skipped]" ? "<em>Question skipped</em>" : r.answer}</div>
            ${r.feedback ? `<div class="feedback-text">💡 ${r.feedback.feedback}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    
    <div class="footer">
      <div class="brand">AITRAININGZONE</div>
      <p>Keep practicing to improve your interview skills!</p>
      <p style="margin-top: 10px; font-size: 12px;">Generated on ${date}</p>
    </div>
  </div>
</body>
</html>
  `;
};
