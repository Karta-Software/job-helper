export type ResumeStandardsSource = {
  name: string;
  url: string;
  evidenceLevel: "current-data" | "current-guidance" | "survey" | "institutional-policy" | "older-data" | "weak";
  finding: string;
};

export type ResumeStandards = {
  id: string;
  researchedAt: string;
  scope: string;
  targets: {
    pages: {
      default: number;
      minimum: number;
      maximum: number;
      notes: string;
    };
    words: {
      minimum: number;
      idealLow: number;
      idealHigh: number;
      maximum: number;
    };
    charactersIncludingSpaces: {
      idealLow: number;
      idealHigh: number;
    };
    renderedTextLines: {
      idealLow: number;
      idealHigh: number;
    };
    bulletCharacters: {
      idealLow: number;
      idealHigh: number;
      maximum: number;
    };
    achievementBullets: {
      idealLow: number;
      idealHigh: number;
    };
  };
  sections: Array<{
    name: string;
    required: boolean;
    notes: string;
  }>;
  styleRules: Array<{
    rule: string;
    rationale: string;
  }>;
  sources: ResumeStandardsSource[];
  openQuestions?: string[];
};

export const seniorTechnicalResumeStandards2026: ResumeStandards = {
  id: "senior-technical-resume-standards-2026-06-04",
  researchedAt: "2026-06-04T00:00:00-08:00",
  scope: "Senior software, technical lead, lead engineer, and staff-adjacent roles in 2026",
  targets: {
    pages: {
      default: 2,
      minimum: 1,
      maximum: 2,
      notes: "Use two pages when the second page is filled with relevant proof. Use one page only for narrow referrals or very short role-specific handoffs."
    },
    words: {
      minimum: 500,
      idealLow: 650,
      idealHigh: 850,
      maximum: 950
    },
    charactersIncludingSpaces: {
      idealLow: 4200,
      idealHigh: 5600
    },
    renderedTextLines: {
      idealLow: 80,
      idealHigh: 100
    },
    bulletCharacters: {
      idealLow: 150,
      idealHigh: 200,
      maximum: 230
    },
    achievementBullets: {
      idealLow: 12,
      idealHigh: 16
    }
  },
  sections: [
    { name: "Contact", required: true, notes: "Keep contact details in the body, not the document header/footer." },
    { name: "Headline", required: true, notes: "Mirror the target role family and seniority." },
    { name: "Summary", required: true, notes: "Two to three lines, roughly 35 to 55 words." },
    { name: "Skills", required: true, notes: "Group 12 to 18 role-matched skills without tables or skill bars." },
    { name: "Experience", required: true, notes: "Prioritize recent, relevant roles with quantified outcomes." },
    { name: "Selected Projects", required: false, notes: "Use when projects prove the target role better than job titles alone." },
    { name: "Education", required: true, notes: "Keep compact unless education is central to the role." },
    { name: "Certifications", required: false, notes: "Include only relevant, current credentials." }
  ],
  styleRules: [
    {
      rule: "Single-column layout with standard section headings.",
      rationale: "Current ATS guidance still treats single-column structure as the safest parsing path."
    },
    {
      rule: "No tables, graphics, skill bars, icons, or critical content in headers or footers.",
      rationale: "These elements can scramble parsing or hide important data."
    },
    {
      rule: "Use 10 to 12 point body text and 14 to 16 point headings.",
      rationale: "Keeps the file readable without shrinking content into a dense wall."
    },
    {
      rule: "Tailor summary, skills, and bullets to the specific posting.",
      rationale: "Current application data shows tailored resumes materially improve interview conversion."
    }
  ],
  sources: [
    {
      name: "Huntr Q1 2026 Job Search Trends Report",
      url: "https://huntr.co/research/job-search-trends-q1-2026",
      evidenceLevel: "current-data",
      finding: "Analyzed 240k jobs and 39k tailored resumes; tailored resumes had about a 2x interview-rate lift and successful bullets clustered near 150 to 200 characters."
    },
    {
      name: "Kickresume 2026 Resume Structure Analysis",
      url: "https://www.kickresume.com/en/press/resume-statistics-structure/",
      evidenceLevel: "current-data",
      finding: "Analyzed more than 2M resumes; median resume length was 365 words, showing the market median is short even though senior candidates may need more depth."
    },
    {
      name: "Resume Genius 2026 Resume Statistics",
      url: "https://resumegenius.com/blog/resume-help/resume-statistics",
      evidenceLevel: "survey",
      finding: "Reports hiring-manager preference for two-page resumes, supporting two pages when experience depth justifies it."
    },
    {
      name: "Jobscan ATS Friendly Resume Format 2026",
      url: "https://www.jobscan.co/blog/20-ats-friendly-resume-templates/",
      evidenceLevel: "current-guidance",
      finding: "Recommends single-column layout, standard fonts, clear section titles, and avoiding tables, text boxes, graphics, and headers/footers for critical content."
    },
    {
      name: "OPM Two-Page Resume Guidance",
      url: "https://piv.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/applicant-guidance-on-the-two-page-resume-limit/",
      evidenceLevel: "institutional-policy",
      finding: "Federal hiring guidance now enforces a two-page limit for federal resumes, useful as a hard cap signal rather than a private-sector universal rule."
    }
  ],
  openQuestions: [
    "Should referral handoff resumes use a one-page relationship-first variant?",
    "Should each target company get a distinct role headline and skills order?",
    "What exact posting language should override the default skill ordering?"
  ]
};

export function isBulletWithinTarget(characterCount: number, standards = seniorTechnicalResumeStandards2026): boolean {
  return (
    characterCount >= standards.targets.bulletCharacters.idealLow &&
    characterCount <= standards.targets.bulletCharacters.idealHigh
  );
}
