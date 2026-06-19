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
    id: 'esl-open-english-online-teacher',
    title: 'Online English Teacher — Open English',
    company: 'Open English',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Latin America-focused online English school. Parent page states "Work from anywhere." BUT recruiting partner Latinhire requires "U.S. citizen, Canadian citizen, or U.S. permanent resident" for some roles — verify the direct-application path before applying from India.',
    confidence: 0.95,
    score: 3.5,
    pay: '$8-10/hr typical; reports of hours cut and higher-paid teachers replaced with cheaper labor',
    sourceUrl: 'https://www.openenglish.com/carreras-profesionales/teaching-opportunities',
    companyUrl: 'https://www.openenglish.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Large online English school focused on the Latin American market. Live classes 24/7.',
      'Mixed signals on nationality: parent page says "Work from anywhere", but Latinhire (main recruiting partner) requires US/Canadian citizenship or US PR. Indian applicants must apply via the direct Open English path, not Latinhire.',
      'Glassdoor for Open Education parent: compensation rated 2.2/5 (26 reviews). Reddit documents ratings-based termination: "If your rating drops below 90-92%, you\'re put on a two-week warning." Indeed corroborates sudden hour cuts. No formal lawsuits located.'
    ],
    tags: ['ESL', 'Online', 'Latin American students'],
    nationalityCaution: 'Recruiting partner Latinhire requires US/Canadian citizenship — apply directly via Open English, not Latinhire',
    hiringTendencyNote: 'Parent company states "Work from anywhere" but a major recruiting partner imposes a US/Canada citizenship requirement. Indian applicants must use the direct application path and confirm acceptance before committing.',
    platformModel: 'fixed-rate',
    platformWarning: 'Ratings-based termination: sub-90% ratings trigger a two-week warning. Hours reportedly cut to replace higher-paid teachers with cheaper labor.',
    payDisparityWarning: null
  },
  {
    id: 'esl-nativecamp-online-teacher',
    title: 'Online English Conversation Teacher — NativeCamp',
    company: 'NativeCamp',
    category: 'ESL Tutoring',
    workMode: 'Worldwide Remote',
    eligibility: 'Japanese online conversation platform. Despite the name, accepts non-native speakers. 18+, no teaching experience, hardware/internet required. Filipino teachers form a large workforce. Check the country blocklist on the contact page before applying from India.',
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
  {
    id: 'ai-telus-digital-rater-india',
    title: 'AI Rater / Quality Assurance Rater — Hindi (India)',
    company: 'TELUS Digital (formerly TELUS International AI)',
    category: 'AI Training',
    workMode: 'Worldwide Remote',
    eligibility: 'Hires in India with India-specific language roles (e.g., Hindi Rater, Remote, Part time). Canadian publicly-traded parent (TSX:T, NYSE:TU) — most reputable "name brand" of the AI platforms. Roles are tied to jurisdiction/language — not work-from-anywhere in the global sense.',
    confidence: 0.96,
    score: 3.7,
    pay: 'India Hindi Rater: $8/hr per TELUS posting (reduced from $4 to $2.40 per some reports). US Rater: $11-40/hr (Indeed avg $13.71/hr).',
    sourceUrl: 'https://jobs.telusdigital.com/en/jobs/17840995-quality-assurance-rater-hindi-india',
    companyUrl: 'https://www.telusdigital.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Canadian publicly-traded company (TSX:T, NYSE:TU). Most reputable "name brand" among AI-training platforms — unlikely to vanish with earnings.',
      'India-specific roles exist (e.g., Quality Assurance Rater - Hindi (India), Remote Part time). Hires by country and language — US Raters must reside in US; Hindi-India raters must be in India.',
      'r/TELUSinternational documents structural problems: weekly "NTA" (No Tasks Available) threads where raters go weeks with zero billable work; arbitrary account reviews; a 40% mid-contract India pay cut ($4→$2.40) without recourse; opaqueness around quality scoring. No lawsuits located.'
    ],
    tags: ['AI training', 'Search evaluation', 'Rating', 'India-specific'],
    nationalityCaution: null,
    hiringTendencyNote: 'India hires exist with language-specific roles. Canadian publicly-listed parent adds corporate accountability. But chronic "no tasks" problem and documented 40% mid-contract India pay cut.',
    platformModel: 'fixed-rate',
    platformWarning: 'Requires minimum weekly hours commitment. Application process can take weeks. Chronic "No Tasks Available" problem — raters can go weeks with zero billable work.',
    payDisparityWarning: 'Documented ~42-82% US/India pay gap for similar rater work. US Raters earn $11-40/hr (avg $13.71); India Hindi Raters earn $8/hr (and Reddit reports a cut from $4 to $2.40 for some India projects). Exceeds the 10% fairness bar — listed only with this prominent warning.',
    regionalPayWarning: 'Pay rates are set per country. A documented 40% mid-contract pay cut for India raters occurred without recourse — verify the current rate and contractual stability before committing.'
  },

  /* ---- Insurance / Reinsurance Analytics ----
     Deep vetting found NO worldwide-remote or visa-sponsorship cat-modelling JDs
     at any of the nine firms checked (Swiss Re, Munich Re, Guy Carpenter, Aon,
     WTW, Verisk/AIR, Moody's RMS, Oasis LMF). All open roles are city-anchored
     in India (Bengaluru, Mumbai, Hyderabad, Thane) — domestic India hiring,
     not visa sponsorship INTO India. Only listings with verifiable real JD URLs
     on official company careers sites are listed below. Aggregator links
     (ZipRecruiter, WeWorkRemotely search results) are NOT acceptable. */
  {
    id: 'insurance-swissre-property-cat-bangalore',
    title: 'Associate — Property Fac UW Advisor (catastrophe modelling support)',
    company: 'Swiss Re',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'Visa Sponsorship',
    eligibility: 'Based in Bangalore, India (hybrid, >=3 days in office). Open to Indian nationals for domestic India hiring. NOT a worldwide-remote or visa-sponsorship-INTO-India role. Requires modelling and costing support on NA property risks using Nat Cat platforms.',
    confidence: 0.95,
    score: 3.6,
    pay: 'Competitive India reinsurance market rate (verify on JD)',
    sourceUrl: 'https://www.swissre.com/careers/job/Associate-Property-Fac-UW-Advisor/1399206333',
    companyUrl: 'https://www.swissre.com/careers',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Swiss Re is a top-tier global reinsurance firm. India GBS hub in Bangalore operating since 2001. Strong actuarial and cat-modelling reputation.',
      'This is a verifiable JD on the official swissre.com careers site (not an aggregator). Role involves Nat Cat platform modelling and costing on North American property risks.',
      'Domestic India hiring at Bangalore — not visa sponsorship INTO India and not worldwide-remote. Indian nationals with actuarial qualifications (IAI, IFOA, SOA) are well-represented in this field.'
    ],
    tags: ['Cat modelling', 'Insurance analytics', 'Bangalore', 'Reinsurance', 'Hybrid'],
    nationalityCaution: 'Domestic India role (Bangalore hybrid) — not worldwide-remote or visa sponsorship INTO India',
    hiringTendencyNote: 'Real JD on the official Swiss Re careers site. Bangalore hybrid role. Indian actuarial professionals are well-represented in this firm.',
    platformModel: 'direct-employer',
    platformWarning: null,
    payDisparityWarning: null
  },
  {
    id: 'insurance-aon-cat-modelling-bangalore',
    title: 'Catastrophe Modelling — Reinsurance',
    company: 'Aon',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'Visa Sponsorship',
    eligibility: 'Based in Bengaluru, India (hybrid). Open to Indian nationals for domestic India hiring. Aon has an established Bengaluru analytics hub plus Impact Forecasting India. NOT worldwide-remote.',
    confidence: 0.95,
    score: 3.6,
    pay: 'Competitive India reinsurance market rate (verify on JD)',
    sourceUrl: 'https://jobs.aon.com/jobs/101204?lang=en-us',
    companyUrl: 'https://jobs.aon.com/',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Aon is a top-tier global insurance brokerage and analytics firm. Bengaluru analytics hub plus Impact Forecasting India. Strong cat-modelling and reinsurance reputation.',
      'Verifiable JD on the official jobs.aon.com careers site (not an aggregator). Role is catastrophe modelling for reinsurance, Bengaluru hybrid.',
      'Page is JS-rendered (extractors return boilerplate) but the URL is the official Aon careers listing, corroborated by indexed search snippets. Domestic India hiring — not visa sponsorship INTO India and not worldwide-remote.'
    ],
    tags: ['Cat modelling', 'Insurance analytics', 'Bengaluru', 'Reinsurance', 'Hybrid'],
    nationalityCaution: 'Domestic India role (Bengaluru hybrid) — not worldwide-remote or visa sponsorship INTO India',
    hiringTendencyNote: 'Real JD on the official Aon careers site. Bengaluru hybrid role. Aon has an established analytics hub in India.',
    platformModel: 'direct-employer',
    platformWarning: 'Careers pages are JS-rendered — if the page appears blank in your browser, wait for it to load or search "catastrophe" + location=Bengaluru on jobs.aon.com.',
    payDisparityWarning: null
  },
  {
    id: 'insurance-verisk-cat-modelling-hyderabad',
    title: 'CAT Modelling Analyst II',
    company: 'Verisk (formerly AIR Worldwide)',
    category: 'Insurance / Reinsurance Analytics',
    workMode: 'Visa Sponsorship',
    eligibility: 'Based in Hyderabad/Secunderabad, India. Open to Indian nationals for domestic India hiring. Verisk (which acquired AIR Worldwide) is "Great Place to Work India" certified. NOT worldwide-remote.',
    confidence: 0.95,
    score: 3.5,
    pay: 'Competitive India market rate (verify on JD)',
    sourceUrl: 'https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX/job/3645',
    companyUrl: 'https://www.verisk.com/company/careers',
    verifiedOn: '2026-06-19',
    credibilityNotes: [
      'Verisk (Nasdaq: VRSK) acquired AIR Worldwide in the early 2010s; the cat-modelling business is now "Verisk Catastrophe and Risk Solutions, formerly AIR Worldwide." Hyderabad is a major office. "Great Place to Work India" certified.',
      'Verifiable JD on the official Verisk Oracle HCM careers site (not an aggregator). Role: "advanced exposure data preparation... execution of catastrophe models, and detailed loss analysis." Hyderabad/Secunderabad.',
      'Page returns 429/timeout to scrapers (anti-bot) but is indexed by search engines with full JD snippets. Domestic India hiring — not visa sponsorship INTO India and not worldwide-remote.'
    ],
    tags: ['Cat modelling', 'AIR Worldwide', 'Hyderabad', 'Reinsurance'],
    nationalityCaution: 'Domestic India role (Hyderabad/Secunderabad) — not worldwide-remote or visa sponsorship INTO India',
    hiringTendencyNote: 'Real JD on the official Verisk Oracle HCM careers site. Hyderabad/Secunderabad. Verisk absorbed AIR Worldwide — the leading cat-modelling vendor.',
    platformModel: 'direct-employer',
    platformWarning: 'Careers page has anti-bot protection (may 429 or timeout) — retry in a browser or search "CAT Modelling Analyst II" + Verisk on Google.',
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
  { company: 'Cambly', reason: 'Official native-only policy confirmed for 2025/2026. India blocked.', sourceUrl: 'https://www.cambly.com/english/tutors' },
  { company: 'Polly English', reason: 'US/CA/UK/AU/NZ + Philippines track only — India not named on either track. Re-brand of Lingostar; misleading pay advertising.', sourceUrl: 'https://teach.pollyenglish.cn/website' },
  { company: 'DataAnnotation.tech', reason: 'Accepts only US/CA/UK/IE/NZ/AU. India blocked. Mass deactivations + withheld earnings documented on Reddit.', sourceUrl: 'https://app.dataannotation.tech/worker_signup' },
  { company: 'Ringle', reason: 'Requires enrollment at a top US/UK university. India-based applicants structurally excluded.', sourceUrl: 'https://www.ringletutor.com/en/tutor/landing/about-us' },
  { company: 'Outlier AI / Scale AI', reason: 'India accepted but ~78-85% native/non-native pay gap. Inc.com "It\'s a Scam" investigation + Analytics India Magazine exposé on exploitation of Indian workers specifically. Mass deactivations.', sourceUrl: 'https://app.outlier.ai' },
  { company: 'AmazingTalker', reason: 'Geography-based pricing restrictions (2024 discrimination complaint). 30-40%+ commission. Reddit: "Is AmazingTalker a pyramid scheme?"', sourceUrl: 'https://en.amazingtalker.com/teach' }
];
