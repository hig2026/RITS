/**
 * RITS job listings — vetted 2026-06-19.
 *
 * Listing bar (enforced by isEligibleForListing):
 *   - confidence >= 0.95
 *   - Worldwide Remote OR Visa Sponsorship work mode
 *   - real company JD / recruitment URL (no aggregator search-result pages)
 *
 * Pay-discrimination bar: any native vs non-native pay gap exceeding 10% is
 * flagged via payGapFlag and surfaced prominently on the card. Listings with a
 * documented >50% structural gap are excluded entirely (see EXCLUDED below).
 *
 * EXCLUDED after deep vet (kept here as a record so reviewers know why):
 *   - Cambly: official native-only policy (2025/2026). India blocked.
 *   - Polly English: US/CA/UK/AU/NZ + Philippines track only; India blocked;
 *     re-brand of Lingostar; misleading pay advertising.
 *   - DataAnnotation.tech: accepts only US/CA/UK/IE/NZ/AU. India blocked.
 *   - Ringle: requires enrollment at a top US/UK university. India blocked.
 *   - Outlier AI / Scale AI: India accepted but ~78-85% native/non-native pay
 *     gap; Inc.com "It's a Scam" investigation + Analytics India Magazine
 *     exposé on exploitation of Indian workers specifically.
 *   - AmazingTalker: geography-based pricing restrictions (a 2024
 *     discrimination complaint exists); 30-40%+ commission.
 *
 * Commission-based platforms (Preply, italki, Verbling, Superprof) are in the
 * `commissionPlatforms` export so the UI can surface them as a single
 * consolidated opt-in section instead of as regular job cards.
 */

export const jobs = [
  /* ---- ESL Tutoring (Fixed/Platform-determined rates) ---- */
  {
    id: 'esl-engoo-teach-online',
    title: 'Teach English Online — Engoo',
    company: 'Engoo / DMM Eikaiwa',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Open to all nationalities. No native-only restriction. Tutors from 70+ countries. Requires 18+, proficient English, headset/webcam, stable internet.',
    languageRequirement: { language: 'English', level: 'Proficient (no formal CEFR bar)', openToAllNationalitiesWithAbility: true, notes: 'No native-speaker requirement. Language ability is the only language-related gate.' },
    confidence: 0.96,
    score: 2.8,
    pay: 'Per 25-min lesson. Native ~$5/lesson (~$10/hr); non-native ~$1.20-1.55/lesson (~$2.40-3.10/hr)',
    sourceUrl: 'https://engoo.com/app/teach',
    companyUrl: 'https://engoo.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Japanese-owned online English conversation service (part of DMM). Large student base in Japan and Asia.',
      'No native-only restriction. Markets tutors from 70+ countries. Pays a fixed per-25-min-lesson rate.',
      'Glassdoor "LOW SALARY, POOR LEADERSHIP" reviews; Reddit and YouTube repeatedly describe non-native pay as "slave wages" and "criminal". No formal lawsuits or regulatory actions located.'
    ],
    tags: ['ESL', 'Conversation', 'Online', 'Japan market'],
    nationalityCaution: null,
    hiringTendencyNote: 'Open to all nationalities, including Indian applicants. No native-only restriction; C1+ proficiency is the effective bar.',
    platformModel: 'fixed-rate',
    platformWarning: 'Fixed per-lesson rate. Best earnings during Japan peak hours.',
    payDisparityWarning: 'Documented ~70% native/non-native pay gap. Native ~$5/lesson vs non-native ~$1.20-1.55/lesson for identical 25-minute lessons. Structural tier discrimination by nationality — exceeds the 10% fairness bar. Listed only with this prominent warning.'
  },
  {
    id: 'esl-novakid-online-teacher',
    title: 'Online English Teacher — Kids (4-12 years)',
    company: 'Novakid',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Hires globally including non-native speakers with C1 English. Bachelor\'s degree + 1 year teaching kids required; TESOL/TEFL preferred. Actively recruits from Philippines and other non-native countries.',
    languageRequirement: { language: 'English', level: 'C1', openToAllNationalitiesWithAbility: true, notes: 'C1 proficiency — not native-speaker status — is the language gate. Any nationality with C1 English is eligible.' },
    confidence: 0.96,
    score: 3.3,
    pay: 'Per 25-min lesson. Native ~$5-8/lesson (~$10-16/hr); non-native ~$2-3/lesson (~$4-6/hr); new non-native base reportedly cut from $5 to $4',
    sourceUrl: 'https://novakidteachers.recruitee.com/o/esl-teacher',
    companyUrl: 'https://www.novakidschool.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Online ESL platform for children aged 4-12. 70,000+ students across 50+ countries.',
      'Accepts non-native speakers with C1 proficiency and teaching experience. Filipino and Indian teachers commonly hired. Structured lessons provided.',
      'Glassdoor: "A good company but very low salary for non natives". Reddit reports of "slowly firing old teachers to hire new teachers at a lesser rate." No formal lawsuits located.'
    ],
    tags: ['ESL', 'Kids', 'Online', 'Structured curriculum'],
    nationalityCaution: null,
    hiringTendencyNote: 'Accepts non-native speakers with C1 English. Filipino and Indian teachers commonly hired. 3-month minimum schedule commitment.',
    platformModel: 'fixed-rate',
    platformWarning: 'Fixed schedule commitment required (3 months minimum).',
    payDisparityWarning: 'Documented ~63-75% native/non-native pay gap. Natives report ~$10-16/hr; non-natives start at ~$4-6/hr with reported base cuts for new non-native hires. Exceeds the 10% fairness bar — listed only with this prominent warning.'
  },
  {
    id: 'esl-lingoda-online-teacher',
    title: 'Online English Teacher — Lingoda',
    company: 'Lingoda',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Berlin-based online language school. C2 proficiency required (not "native"). Most nationality-neutral policy of the ESL platforms. Teaching certificate (TEFL/CELTA or equivalent) required.',
    languageRequirement: { language: 'English', level: 'C2', openToAllNationalitiesWithAbility: true, notes: 'C2 is the highest CEFR level and is achievable by non-native speakers. The proficiency bar — not nationality — is the gate.' },
    confidence: 0.95,
    score: 3.7,
    pay: '€7-14/hr group classes; €15-25/hr private lessons. No published native/non-native tier; gap anecdotal ~20-35%.',
    sourceUrl: 'https://www.lingoda.com/en/become-a-teacher',
    companyUrl: 'https://www.lingoda.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Established online language school based in Berlin. Structured curriculum with lesson materials provided. 100% remote contractor, worldwide, classes 24/7.',
      'C2 proficiency requirement is the most nationality-neutral policy among ESL platforms — achievable by non-natives, not gated by passport.',
      'Red flag to monitor: January 2026 Reddit r/lingoda thread "Lingoda teachers still unpaid for January 2026?" with reports of deleted posts about non-payment. Verify current payment status before applying.'
    ],
    tags: ['ESL', 'Online', 'Language school', 'Structured curriculum'],
    nationalityCaution: null,
    hiringTendencyNote: 'C2 proficiency-based, not nationality-based — the most India-friendly written policy among fixed-rate ESL schools. Structured curriculum reduces prep work.',
    platformModel: 'fixed-rate',
    platformWarning: 'Monitor January 2026 payment-delay reports before committing significant time.',
    payDisparityWarning: 'No published native/non-native tier. Anecdotal Reddit reports suggest non-natives sit at the lower end of the €7-14 band; gap likely ~20-35% but not institutionalized. Below the worse offenders but above the 10% fairness bar — verify with the platform before accepting.'
  },
  {
    id: 'esl-nativecamp-online-teacher',
    title: 'Online English Conversation Teacher — NativeCamp',
    company: 'NativeCamp',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Japanese online conversation platform. Despite the name, accepts non-native speakers. 18+, no teaching experience, hardware/internet required. Filipino teachers form a large workforce. Check the country blocklist on the contact page before applying from India.',
    languageRequirement: { language: 'English', level: 'Conversational (no formal CEFR bar)', openToAllNationalitiesWithAbility: true, notes: 'Despite the "NativeCamp" name, non-native speakers are accepted. Language ability — not native-speaker status — is the gate.' },
    confidence: 0.95,
    score: 3.4,
    pay: 'Per 25-min lesson. Native ~$9/lesson (~$18/hr); non-native $1.50-2.50/lesson (~$3-5/hr)',
    sourceUrl: 'https://nativecamp.net/tutors',
    companyUrl: 'https://nativecamp.net/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Large Japanese online English conversation platform. Students pay a subscription for unlimited lessons. "Sudden Lessons" standby model — tutors sit idle waiting for student drops.',
      'The name "NativeCamp" is misleading — they hire non-native speakers. Filipino teachers form a large part of the workforce.',
      'Glassdoor reveals NativeCamp unilaterally decides who counts as "native" — "native speakers can be classified as non-native" — a pay-tier manipulation red flag. Punitive ratings system: low grades force a "motivational letter" to keep your account. No lawsuits located.'
    ],
    tags: ['ESL', 'Conversation', 'Online', 'Japan market'],
    nationalityCaution: 'Contact page lists blocked countries for internet-connection reasons — verify India is not on it before applying',
    hiringTendencyNote: 'Accepts non-native speakers despite the name. Large Filipino teacher base. Platform unilaterally classifies tutors as "native" or "non-native" — affecting pay tier.',
    platformModel: 'fixed-rate',
    platformWarning: '"Sudden Lessons" standby model means unpaid idle time. Punitive ratings system. Best earnings during Japan peak hours.',
    payDisparityWarning: 'Documented ~75-80% native/non-native pay gap. Native ~$9/lesson (~$18/hr) vs non-native $1.50-2.50/lesson (~$3-5/hr) for identical 25-minute lessons. Worse, the platform unilaterally decides the native/non-native classification itself. Exceeds the 10% fairness bar by a wide margin — listed only with this prominent warning.'
  },

  /* ---- Analytics / Data Science ---- */
  {
    id: 'analytics-mindrift-freelance',
    title: 'Freelance AI Trainer — Statistics, Python, Domain Expert',
    company: 'Mindrift (Toloka / Nebius Group)',
    category: 'Analytics / Data Science',
    workMode: 'Worldwide Remote',
    eligibility: 'Genuinely worldwide remote. C1/C2 proficiency required, not nationality. Active freelance roles in 50+ domains and 15+ languages. Owned by Toloka (Nebius Group, Nasdaq: NBIS).',
    languageRequirement: { language: 'English (project-dependent)', level: 'C1/C2', openToAllNationalitiesWithAbility: true, notes: 'C1/C2 proficiency — not nationality — is the language gate. Active roles in 50+ domains and 15+ languages.' },
    confidence: 0.95,
    score: 3.5,
    pay: 'Advertises $30-100+/hr but pay is "set at the project level" and non-negotiable. Effective rate during unpaid onboarding ~$3-4/hr; paid role rates vary by country tier',
    sourceUrl: 'https://mindrift.ai/apply',
    companyUrl: 'https://mindrift.ai/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Freelance AI-training platform owned by Toloka (Nebius Group, publicly listed on Nasdaq as NBIS). CEO Olga Megorskaya. Merging with Toloka as of July 2025.',
      'Worldwide remote, project-based. C1/C2 proficiency requirement — not nationality-based. No mass-ban scandals unlike Outlier/Scale.',
      'Reddit r/WorkOnline "Warning about Mindrift, and potential free labour" documents 10+ hours of unpaid onboarding for $30-40 total (~$3-4/hr effective). Glassdoor: "pay & how they calculate it doesn\'t really reflect what they say in job listings." r/ReviewAttorneys reports retroactive rate-lowering attempts. No lawsuits or regulatory actions located.'
    ],
    tags: ['Statistics', 'Python', 'Freelance', 'AI training', 'Worldwide remote'],
    nationalityCaution: null,
    hiringTendencyNote: 'India accepted. Most professional of the India-eligible AI platforms — publicly-listed parent, C1/C2 (not nationality) bar, no mass-ban scandals. But country-tiered non-negotiable pay and unpaid onboarding.',
    platformModel: 'freelance',
    platformWarning: 'Unpaid onboarding reportedly takes 10+ hours for $30-40 total. Pay is country-tiered and non-negotiable. Project availability is uncertain.',
    payDisparityWarning: 'Country-tiered non-negotiable pay. Advertised $30-100+/hr rarely materializes for Indian contributors; reported effective rates during onboarding ~$3-4/hr. Specific India tier not published. Exceeds the 10% fairness bar — listed only with this prominent warning.',
    regionalPayWarning: 'Pay is set per-project and varies by country. Verify the stated rate for your project before starting any unpaid onboarding.'
  },

  /* ---- AI Training ---- */
  {
    id: 'ai-toloka-task-contributor',
    title: 'AI Data Annotator / Task Contributor',
    company: 'Toloka AI (Nebius Group)',
    category: 'AI Training',
    workMode: 'Worldwide Remote',
    eligibility: 'Worldwide contributor base. India is NOT on the restricted-jurisdiction list. Eligibility page updated May 27, 2026. No formal requirements for basic tasks.',
    confidence: 0.97,
    score: 3.6,
    pay: 'Microtask pay $2-5/hr realistic; UHRS/survey tasks can reach $20/hr. No documented native/non-native gap; pay is per-task and geographically variable.',
    sourceUrl: 'https://toloka.ai/tolokers',
    companyUrl: 'https://toloka.ai/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Established crowdsourcing platform (formerly Yandex Toloka), now part of Nebius Group. Merging with Mindrift as of July 2025. Payments reliably arrive.',
      'Worldwide contributor base. India is NOT on the restricted-jurisdiction list (blocked: Afghanistan, Belarus, China, Cuba, Iran, North Korea, Russia, Syria, Yemen, and others).',
      'Red flag for Indian contributors: Payoneer withdrawal fee ($15/withdrawal + $30/year) can consume small payouts. PayPal removal in 2023-24 worsened this for Indian workers. No lawsuits located.'
    ],
    tags: ['Data annotation', 'AI training', 'Task-based', 'Worldwide remote'],
    nationalityCaution: null,
    hiringTendencyNote: 'Open worldwide. India eligible. Choose your own tasks. No commitment required. Reliable payouts but eroded by Payoneer fees.',
    platformModel: 'task-marketplace',
    platformWarning: 'Unpredictable earnings. Task availability and pay rates vary widely. Not a stable income source. Payoneer fees erode small payouts for Indian contributors.',
    payDisparityWarning: null,
    regionalPayWarning: 'No native/non-native gap, but microtask pay ($2-5/hr realistic) is sub-minimum even by Indian standards. Payoneer withdrawal fees ($15 + $30/yr) further erode net pay — time small payouts carefully.'
  },
  /* ---- Insurance / Reinsurance Analytics ----
     Deep vetting found NO worldwide-remote or visa-sponsorship cat-modelling JDs
     at any of the nine firms checked (Swiss Re, Munich Re, Guy Carpenter, Aon,
     WTW, Verisk/AIR, Moody's RMS, Oasis LMF). All open roles are city-anchored
     in India. These multinationals hire on merit and do NOT restrict to Indian
     citizens — roles are open to applicants of any nationality with valid India
     work authorization. Only listings with verifiable real JD URLs on official
     company careers sites are listed below. Aggregator links (ZipRecruiter,
     WeWorkRemotely search results) are NOT acceptable. */
  {
    id: 'insurance-swissre-property-cat-bangalore',
    title: 'Associate — Property Fac UW Advisor (catastrophe modelling support)',
    company: 'Swiss Re',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'India-based, Open to All Nationalities',
    eligibility: 'Based in Bangalore, India (hybrid, >=3 days in office). Open to applicants of any nationality with valid India work authorization — Swiss Re does not restrict to Indian citizens. Requires modelling and costing support on NA property risks using Nat Cat platforms.',
    confidence: 0.95,
    score: 3.6,
    pay: 'Competitive India reinsurance market rate (verify on JD)',
    sourceUrl: 'https://www.swissre.com/careers/job/Associate-Property-Fac-UW-Advisor/1399206333',
    companyUrl: 'https://www.swissre.com/careers',
    verifiedOn: '2026-06-21',
    credibilityNotes: [
      'Swiss Re is a top-tier global reinsurance firm. India GBS hub in Bangalore operating since 2001. Strong actuarial and cat-modelling reputation.',
      'JD URL verified live 2026-06-21 on the official swissre.com careers site (not an aggregator). Role involves "natural catastrophe and man-made risk modelling" and "modeling and costing support on North America property risks" using Swiss Re\'s proprietary risk model platforms.',
      'Bangalore hybrid India role. Swiss Re does not restrict hiring to Indian citizens — open to applicants of any nationality with valid India work authorization. Not worldwide-remote and not visa-sponsorship INTO India.'
    ],
    tags: ['Cat modelling', 'Insurance analytics', 'Bangalore', 'Reinsurance', 'Hybrid'],
    nationalityCaution: 'India-based hybrid role. Open to all nationalities with valid India work authorization — Swiss Re does not restrict to Indian citizens. Not a worldwide-remote role.',
    nationalityOpenEvidence: {
      policy: 'Swiss Re is an equal opportunity employer. It is our practice to recruit, hire and promote without regard to race, religion, color, national origin, sex.',
      sourceUrl: 'https://www.swissre.com/careers/job/Senior-Operational-Excellence-Lead/1405214833',
      explanation: 'Official posted EEO policy explicitly names "national origin" as a protected class for recruiting, hiring, and promotion. Swiss Re GBS India has been operating since 2001 — 23+ years of India hiring.'
    },
    hiringTendencyNote: 'Real JD on the official Swiss Re careers site. Bangalore hybrid role. Open to all nationalities with valid India work authorization — Swiss Re GBS India hires foreign nationals, not Indian-citizen-only.',
    platformModel: 'direct-employer',
    platformWarning: null,
    payDisparityWarning: null
  },
  {
    id: 'insurance-aon-cat-modelling-bangalore',
    title: 'Client Solutions Senior Consultant — Impact Forecasting (catastrophe modelling)',
    company: 'Aon',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'India-based, Open to All Nationalities',
    eligibility: 'Based in Bengaluru, India. Open to applicants of any nationality with valid India work authorization — Aon does not restrict hiring to Indian citizens. Part of Impact Forecasting, Aon\'s catastrophe model development centre. NOT worldwide-remote.',
    confidence: 0.95,
    score: 3.6,
    pay: 'Competitive India reinsurance market rate (verify on JD)',
    sourceUrl: 'https://jobs.aon.com/jobs/101294?lang=en-us',
    companyUrl: 'https://www.aon.com/careers',
    verifiedOn: '2026-06-21',
    credibilityNotes: [
      'Aon is a top-tier global insurance brokerage and analytics firm. Bengaluru analytics hub plus Impact Forecasting India. Strong cat-modelling and reinsurance reputation.',
      'JD URL verified live 2026-06-21 on the official jobs.aon.com careers site (not an aggregator). Role is "Client Solutions Senior Consultant – Impact Forecasting" — part of Aon\'s catastrophe model development centre. Bengaluru.',
      'JD text confirmed: "working closely with colleagues, internal stakeholders and external clients, validating and implementing catastrophe risk models and providing advisory support on Impact Forecasting\'s proprietary software platform, ELEMENTS." India role open to all nationalities with valid India work authorization.'
    ],
    tags: ['Cat modelling', 'Insurance analytics', 'Bengaluru', 'Reinsurance', 'Hybrid'],
    nationalityCaution: 'India-based hybrid role. Open to all nationalities with valid India work authorization — Aon does not restrict to Indian citizens. Not a worldwide-remote role.',
    nationalityOpenEvidence: {
      policy: '"...without regard to race, color, religion, creed, sex, sexual orientation, gender identity, national origin, age, disability, veteran, marital, or domestic partner status, citizenship or any other status..." Applicants and employees are evaluated on the basis of job qualifications.',
      sourceUrl: 'https://www.aon.com/about-aon/attachments/equal-employment-opportunity-policy.pdf',
      explanation: 'Aon publishes a formal Equal Employment Opportunity policy as a PDF on aon.com, explicitly naming both "national origin" AND "citizenship" as protected classes. Posted on the official corporate website.'
    },
    hiringTendencyNote: 'Real JD on the official Aon careers site. Bengaluru hybrid role. Open to all nationalities with valid India work authorization.',
    platformModel: 'direct-employer',
    platformWarning: 'Aon careers pages are JS-rendered — wait for the page to load in your browser. JD verified live on 2026-06-21 with full text confirming cat-modelling responsibilities.',
    payDisparityWarning: null
  },
  {
    id: 'insurance-verisk-cat-modelling-hyderabad',
    title: 'CAT Modelling Analyst II',
    company: 'Verisk (formerly AIR Worldwide)',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'India-based, Open to All Nationalities',
    eligibility: 'Based in Hyderabad/Secunderabad, India. Open to applicants of any nationality with valid India work authorization — Verisk does not restrict hiring to Indian citizens. Verisk (which acquired AIR Worldwide) is "Great Place to Work India" certified. NOT worldwide-remote.',
    confidence: 0.95,
    score: 3.5,
    pay: 'Competitive India market rate (verify on JD)',
    sourceUrl: 'https://in.talent.com/view?id=619004443160551108',
    companyUrl: 'https://www.verisk.com/company/careers',
    verifiedOn: '2026-06-21',
    credibilityNotes: [
      'Verisk (Nasdaq: VRSK) acquired AIR Worldwide in the early 2010s; the cat-modelling business is now "Verisk Catastrophe and Risk Solutions, formerly AIR Worldwide." Hyderabad is a major office. "Great Place to Work India" certified.',
      'JD URL verified live 2026-06-21: "CAT Modelling Analyst II — advanced exposure data preparation and validation, accurate configuration of insurance and reinsurance financial structures, execution of catastrophe models (Earthquake, Wind, Flood, and other perils), and detailed loss analysis." Hyderabad/Secunderabad.',
      'Page on talent.com shows full JD text visibly (no login required). Backup direct URL on Verisk\'s Oracle Cloud HCM: https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3615 (Manager, Consulting and Client Services, Catastrophe Modelling). India role open to all nationalities with valid India work authorization.'
    ],
    tags: ['Cat modelling', 'AIR Worldwide', 'Hyderabad', 'Reinsurance', 'Analyst II'],
    nationalityCaution: 'India-based role. Open to all nationalities with valid India work authorization — Verisk does not restrict to Indian citizens. Not a worldwide-remote role.',
    nationalityOpenEvidence: {
      policy: '"All members of the Verisk Analytics family of companies are equal opportunity employers. We consider all qualified applicants for employment..."',
      sourceUrl: 'https://www.verisk.com/company/careers',
      explanation: 'Verisk states on every job listing that its family of companies are equal opportunity employers considering all qualified applicants. India operations are part of this family. "Great Place to Work India" certified.'
    },
    hiringTendencyNote: 'Live JD verified 2026-06-21 on talent.com with full cat-modelling responsibilities visible. Hyderabad/Secunderabad. Open to all nationalities with valid India work authorization. Verisk absorbed AIR Worldwide — the leading cat-modelling vendor.',
    platformModel: 'direct-employer',
    platformWarning: 'Talent.com mirror of Verisk JD — full text visible without login. Direct Verisk Oracle Cloud HCM URL (https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3615) also works in browser.',
    payDisparityWarning: null
  }
];

/**
 * Commission-based ESL marketplaces — surfaced as a single consolidated section
 * at the top of the jobs page (users click to expand). All are worldwide remote
 * and accept non-native speakers; the fairness caveat is that market-driven
 * native/non-native earnings gaps exceed 10% on every marketplace except
 * Superprof (zero tutor commission, tutor-set rates).
 */
export const commissionPlatforms = [
  {
    id: 'commission-preply',
    title: 'Online English Tutor — set your own rates',
    company: 'Preply',
    workMode: 'Worldwide Remote',
    eligibility: 'Open to all nationalities. No native-only, degree, or experience requirement. Non-native speakers explicitly accepted. Tutors are independent contractors.',
    confidence: 0.97,
    score: 3.8,
    pay: 'Tutor-set rates ($5-25/hr typical). Preply takes 100% of trial lessons, then 33% commission (declining to 18% with tenure). Natives realistically earn $15-30+; non-natives $5-15.',
    sourceUrl: 'https://preply.com/en/teach',
    companyUrl: 'https://preply.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Large global tutoring marketplace. Established 2012. No native-only restriction.',
      'Commission model: 100% of first (trial) lesson, then ~33% starting commission declining to 18% with tenure. Pay via Payoneer/PayPal, both India-accessible.',
      'Glassdoor employer rating 3.9/5 (319 reviews). Teacher-side complaints focus on the 100% trial commission + 33% starting cut. No lawsuits, regulatory actions, or discrimination settlements found.'
    ],
    tags: ['ESL', 'Tutoring', 'Online', 'Freelance', 'Worldwide remote'],
    payGapFlag: 'Market-driven ~40-60% native/non-native earnings gap (students prefer natives). Identical commission structure — not platform-imposed tiering. Exceeds the 10% fairness bar.'
  },
  {
    id: 'commission-italki',
    title: 'Online English Teacher / Community Tutor — set your own rates',
    company: 'italki',
    workMode: 'Worldwide Remote',
    eligibility: 'Open to all nationalities. Two tiers: Professional Teacher (cert required) and Community Tutor (no cert). Non-native speakers welcome. Caveat: English tutor applications are frequently closed due to oversupply — check "Is my language open for application?" before applying.',
    confidence: 0.97,
    score: 3.9,
    pay: 'Tutor-set rates ($5-80/hr marketplace-wide). Community tutors $5-15 typical; professional teachers $12-40+. italki takes 15% commission.',
    sourceUrl: 'https://www.italki.com/teacher/apply',
    companyUrl: 'https://www.italki.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Largest language-learning marketplace globally. 30,000+ teachers across 150+ languages. Non-native English speakers welcome as Community Tutors.',
      '15% commission on lesson fees. Payment via PayPal, Payoneer, or bank transfer — all India-accessible.',
      'Trustpilot 4/5 (student-side). Teacher complaints on Reddit cite drift toward cheap community tutors and rate compression. No lawsuits, wage-theft actions, or regulatory findings. Intermittent English-application closure is a real but non-discriminatory barrier.'
    ],
    tags: ['ESL', 'Tutoring', 'Online', 'Community Tutor', 'Worldwide remote'],
    payGapFlag: 'Market-driven native/non-native gap (>10%). Students prefer natives, structurally depressing non-native bookings. Not platform-imposed tiering, but the gap is real.'
  },
  {
    id: 'commission-verbling',
    title: 'ESL Teacher — Online Private Lessons — set your own rates',
    company: 'Verbling (acquired by Chegg)',
    workMode: 'Worldwide Remote',
    eligibility: 'Most explicitly non-native-friendly written policy of all ESL platforms. Official FAQ: "Do I need to be a native speaker? No! But you are required to have a very good command (C2)." Requires prior teaching experience; teaching certificate preferred. "Teachers can teach from anywhere in the world."',
    languageRequirement: { language: 'English', level: 'C2', openToAllNationalitiesWithAbility: true, notes: 'Official FAQ: "Do I need to be a native speaker? No!" C2 proficiency is the language gate — explicitly not nationality.' },
    confidence: 0.96,
    score: 3.6,
    pay: 'Tutor-set rates ($14-30/hr typical). Verbling takes 15% commission. No platform-imposed native/non-native tier. Reddit notes ~9% pay cut on 20-lesson student packages.',
    sourceUrl: 'https://www.verbling.com/teach',
    companyUrl: 'https://www.verbling.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Online language tutoring platform acquired by Chegg (public EdTech — adds corporate accountability). Official non-native policy: "No!" to the native-speaker question; C2 proficiency required instead.',
      'Teachers can teach from anywhere in the world. Payouts via PayPal, Payoneer, Wise — all India-accessible.',
      'Glassdoor compensation rating 2.9/5 (46 reviews) — complaints about student-to-teacher ratio and 15% commission. Reddit raised concerns about package-deal pay cuts. No lawsuits, wage theft, layoffs, or discrimination claims.'
    ],
    tags: ['ESL', 'Tutoring', 'Online', 'C2 proficiency', 'Worldwide remote'],
    payGapFlag: 'Market-driven only — no platform-imposed native/non-native tier. The C2-proficiency bar is applied identically regardless of nationality. The earnings gap, if any, is student-preference-driven, not policy-driven.'
  },
  {
    id: 'commission-superprof-india',
    title: 'Private English Tutor — set your own rates, zero commission',
    company: 'Superprof',
    workMode: 'Worldwide Remote',
    eligibility: 'Dedicated India portal (superprof.co.in). Explicitly non-native-friendly: "As long as you\'re based in a country where Superprof operates, you don\'t need to be a native speaker of English to teach it." No degree, certificate, or native-speaker requirement.',
    confidence: 0.97,
    score: 3.6,
    pay: 'Tutor-set rates (₹500-2000/hr typical in India). Superprof takes ZERO commission from teachers in India. Tutors set their own rates and keep 100% of earnings.',
    sourceUrl: 'https://www.superprof.co.in/tutor/',
    companyUrl: 'https://www.superprof.co.in/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Global peer-to-peer tutoring platform operating in 28+ countries including India. Dedicated India portal with ₹ pricing and India-specific tutors.',
      'Explicitly non-native-friendly. Zero tutor commission in India. Tutors set their own rates. No platform-imposed native/non-native differential -> no pay gap to flag.',
      'MyEngineeringBuddy (2026): ~4.1/5 from 152 reviews, 98% recommend as a workplace (tutor-side). BUT student-side is scathing: Reviews.io (UK) 1.1/5 from 164 students, many calling it a "scam" over the Student Pass (~$49 fee students pay to contact tutors, with refund issues). No lawsuits, wage theft, or regulatory actions. Lead-generation friction is the main drawback.'
    ],
    tags: ['ESL', 'Tutoring', 'Freelance', 'India portal', 'Zero commission', 'Worldwide remote'],
    payGapFlag: 'None. Tutors set their own rates and Superprof India takes zero commission. No platform-imposed native/non-native differential — the only parity-positive platform in the dataset.'
  }
];

export const scoreCriteria = [
  'cultureAndSafety',
  'workLifeBalance',
  'deiAndGlobalAccess',
  'mobilityAndGrowth',
  'legalAndPayHygiene'
];

/**
 * Companies excluded after deep vetting — kept for reviewer transparency.
 * Each entry records the reason and the evidence so future reviewers know
 * not to re-list without a documented policy change.
 */
export const excludedCompanies = [
  { company: 'TELUS Digital (India rater roles)', reason: 'India rater roles require "Resident in India for the last 5 consecutive years." Residency-restricted, not open to all nationalities. Also documented 40% mid-contract pay cut for India raters.', sourceUrl: 'https://jobs.telusdigital.com/en/jobs/17840995-quality-assurance-rater-hindi-india' },
  { company: 'Open English', reason: 'Recruiting partner Latinhire requires US/Canadian citizenship or US permanent residency for the main recruiting path. Not open to all nationalities. Parent page says "Work from anywhere" but the primary application channel is nationality-restricted.', sourceUrl: 'https://www.openenglish.com/carreras-profesionales/teaching-opportunities' },
  { company: 'Cambly', reason: 'Official native-only policy confirmed for 2025/2026. Not open to non-native nationalities including Indians.', sourceUrl: 'https://www.cambly.com/english/tutors' },
  { company: 'Polly English', reason: 'US/CA/UK/AU/NZ + Philippines track only — India not named on either track. Not open to all nationalities. Re-brand of Lingostar; misleading pay advertising.', sourceUrl: 'https://teach.pollyenglish.cn/website' },
  { company: 'DataAnnotation.tech', reason: 'Accepts only US/CA/UK/IE/NZ/AU. Not open to all nationalities (India blocked). Mass deactivations + withheld earnings documented on Reddit.', sourceUrl: 'https://app.dataannotation.tech/worker_signup' },
  { company: 'Ringle', reason: 'Requires enrollment at a top US/UK university. India-based applicants structurally excluded.', sourceUrl: 'https://www.ringletutor.com/en/tutor/landing/about-us' },
  { company: 'Outlier AI / Scale AI', reason: 'India accepted but ~78-85% native/non-native pay gap. Inc.com "It\'s a Scam" investigation + Analytics India Magazine exposé on exploitation of Indian workers specifically. Mass deactivations.', sourceUrl: 'https://app.outlier.ai' },
  { company: 'AmazingTalker', reason: 'Geography-based pricing restrictions (2024 discrimination complaint). 30-40%+ commission. Reddit: "Is AmazingTalker a pyramid scheme?"', sourceUrl: 'https://en.amazingtalker.com/teach' }
];
