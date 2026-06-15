/**
 * Company vetting database.
 * Stores persistent company profiles with ratings, hiring tendency findings,
 * and a review-by date so future scrapes skip re-researching known companies.
 *
 * Source boards store the base URL for each job board — individual job links
 * are ephemeral but the board itself is a stable scraping source.
 */

export const companies = {
  preply: {
    name: 'Preply',
    url: 'https://preply.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.8,
    platformModel: 'commission',
    commissionNote: 'Commission varies by tenure: 100% of first lesson, then ~33%. Tutors are independent contractors.',
    hiringTendency: 'Open to all nationalities. Non-native speakers explicitly accepted.',
    payNotes: 'Tutors set own rates. Payment via Payoneer or direct bank transfer. Available in India.',
    socialMediaFindings: 'Generally positive reviews on Trustpilot and Reddit. Some complaints about commission structure and student no-shows.',
    flags: []
  },
  italki: {
    name: 'italki',
    url: 'https://www.italki.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.9,
    platformModel: 'commission',
    commissionNote: 'italki takes 15% commission. Teachers set own rates.',
    hiringTendency: 'Open to all nationalities. Two tiers: Professional Teacher (cert required) and Community Tutor (no cert). Non-native speakers welcome.',
    payNotes: 'Payment via PayPal, Payoneer, or bank transfer. Widely used by Indian teachers.',
    socialMediaFindings: 'Largest language marketplace. Strong reputation. Teachers report steady student flow after building profile.',
    flags: []
  },
  amazingtalker: {
    name: 'AmazingTalker',
    url: 'https://en.amazingtalker.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.7,
    platformModel: 'commission',
    commissionNote: 'Platform takes commission (percentage varies). Teachers set own rates.',
    hiringTendency: 'Taiwan-based. Open to all nationalities. Strong demand for English teachers from diverse backgrounds.',
    payNotes: 'Payment processed through platform. Verify payment method availability for India.',
    socialMediaFindings: 'Fast-growing in Asia-Pacific. Mixed reviews on commission transparency. Good for building a student base in Asia.',
    flags: []
  },
  verbling: {
    name: 'Verbling',
    url: 'https://www.verbling.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.6,
    platformModel: 'commission',
    commissionNote: 'Verbling takes a platform fee. Teachers set own rates and schedules.',
    hiringTendency: 'Open marketplace for language teachers worldwide. Non-native speakers accepted. Acquired by Babbel.',
    payNotes: 'Verify current payment method availability for India before signing up.',
    socialMediaFindings: 'Acquired by Babbel in 2021. Some concerns about lower student volume post-acquisition. Platform still operational.',
    flags: []
  },
  engoo: {
    name: 'Engoo / DMM Eikaiwa',
    url: 'https://engoo.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-09-15',
    rating: 2.8,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Global tutor recruitment. Non-native English speakers accepted but historically paid significantly less than native speakers.',
    payNotes: 'Fixed per-lesson rate set by platform. Documented native/non-native pay gap.',
    socialMediaFindings: 'Multiple Glassdoor and Reddit reports confirm significant pay disparity. In 2015 non-natives were paid $1.50-3/hr vs $10/hr for natives. Reports from 2020s suggest the gap has narrowed but still exists. Some tutors report rates as low as $2/lesson for non-natives.',
    payDisparityEvidence: 'Documented 2015 pay gap: non-natives USD 1.50-3/hr vs natives USD 10/hr. Recent reports suggest gap persists albeit narrower. Non-native teachers may receive 50-70% less than native speakers for identical work.',
    flags: ['pay-disparity']
  },
  cambly: {
    name: 'Cambly',
    url: 'https://www.cambly.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-09-15',
    rating: 3.5,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Historically native-speaker-only. Some reports of expanded acceptance but no official policy change confirmed.',
    payNotes: '$0.17/minute (~$10.20/hour) for regular sessions. Payment via PayPal weekly.',
    socialMediaFindings: 'Large platform but strict on native-speaker requirement. Reddit and Glassdoor show no reliable evidence of non-native acceptance as of 2026.',
    flags: ['nationality-restriction']
  },
  teflcom: {
    name: 'TEFL.com',
    url: 'https://www.tefl.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.4,
    platformModel: 'job-board',
    commissionNote: null,
    hiringTendency: 'Aggregator — listings vary by employer. Some explicitly state all nationalities, others restrict.',
    payNotes: 'Varies by listing and employer.',
    socialMediaFindings: 'One of the largest ESL job boards. Legitimate but listings change frequently. Always verify directly with the employer.',
    flags: []
  },
  mindrift: {
    name: 'Mindrift',
    url: 'https://mindrift.ai/',
    vettedOn: '2026-06-09',
    reviewBy: '2026-12-09',
    rating: 3.5,
    platformModel: 'freelance',
    commissionNote: null,
    hiringTendency: 'Remote AI-training. No country restriction in listings. Freelance model.',
    payNotes: 'Variable-hours contract work. Verify payment method availability for India.',
    socialMediaFindings: 'Relatively new AI training platform. Limited but neutral reviews. Freelance model with task-based pay.',
    flags: []
  },
  toloka: {
    name: 'Toloka AI',
    url: 'https://toloka.ai/',
    vettedOn: '2026-06-09',
    reviewBy: '2026-12-09',
    rating: 3.6,
    platformModel: 'task-marketplace',
    commissionNote: null,
    hiringTendency: 'Worldwide contributor base. Tasks available globally.',
    payNotes: 'Task-by-task pay. Varies widely. Review rates carefully.',
    socialMediaFindings: 'Established crowdsourcing platform (formerly Yandex Toloka). Large global community. Pay can be low for some tasks.',
    flags: []
  },
  lingoda: {
    name: 'Lingoda',
    url: 'https://www.lingoda.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.7,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Online language school. Hires both native and non-native speakers with appropriate qualifications. Teaching certificate required.',
    payNotes: 'Fixed rate per class (~€8-14 per 60-min group class). Higher for private lessons.',
    socialMediaFindings: 'Berlin-based. Professional reputation. Glassdoor reviews mention structured curriculum and decent support. Some complaints about scheduling rigidity.',
    flags: []
  },
  openEnglish: {
    name: 'Open English',
    url: 'https://www.openenglish.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.5,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Online English school focused on Latin American students. Hires teachers globally. Preference for native speakers but non-natives with credentials accepted.',
    payNotes: 'Fixed hourly rate. Reports vary from $8-15/hr depending on experience.',
    socialMediaFindings: 'Large platform in LatAm market. Mixed Glassdoor reviews — some praise flexibility, others cite low pay and scheduling issues.',
    flags: []
  },
  pollyEnglish: {
    name: 'Polly English',
    url: 'https://pollyenglish.com/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.3,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Online ESL platform. Advertises $16-30/hr. Open to native and non-native speakers.',
    payNotes: '$16-30/hr advertised. Verify actual rates and payment terms.',
    socialMediaFindings: 'Smaller platform. Limited reviews online. Listed on Dave\'s ESL Cafe. Verify payment reliability before committing.',
    flags: []
  },
  nativeCamp: {
    name: 'NativeCamp',
    url: 'https://nativecamp.net/',
    vettedOn: '2026-06-15',
    reviewBy: '2026-12-15',
    rating: 3.4,
    platformModel: 'fixed-rate',
    commissionNote: null,
    hiringTendency: 'Japanese online English conversation platform. Despite the name, accepts non-native speakers. Filipino teachers form a large part of the workforce.',
    payNotes: 'Fixed rate per lesson. Reports suggest $4-8/hr for non-peak, higher during peak Japan hours.',
    socialMediaFindings: 'Large student base in Japan. The name "NativeCamp" is misleading — they hire non-natives. Pay is on the lower end. Flexible scheduling.',
    flags: []
  }
};

/**
 * Source boards — stable base URLs for scraping ESL and remote job listings.
 * Individual job links are ephemeral; these are the entry points for future scrapes.
 */
export const sourceBoards = [
  {
    id: 'eslcafe-international',
    name: "Dave's ESL Cafe — International",
    url: 'https://www.eslcafe.com/jobs/international',
    focus: 'ESL teaching positions worldwide (in-person and online)',
    lastScraped: '2026-06-15',
    notes: 'One of the oldest ESL job boards. Mix of in-person and online. Many listings require native speakers — apply global-accessibility pre-filter carefully.'
  },
  {
    id: 'eslcafe-china',
    name: "Dave's ESL Cafe — China",
    url: 'https://www.eslcafe.com/jobs/china',
    focus: 'ESL teaching in China (mostly in-person, visa-sponsored)',
    lastScraped: '2026-06-15',
    notes: 'Most jobs require physical presence in China and native-speaker Z visa. Few pass the global-accessibility pre-filter.'
  },
  {
    id: 'teflcom',
    name: 'TEFL.com Job Seeker',
    url: 'https://www.tefl.com/job-seeker/',
    focus: 'ESL/TEFL teaching positions globally',
    lastScraped: '2026-06-15',
    notes: 'Large board with frequent turnover. Listings include online and in-person. Always verify listing is still active.'
  },
  {
    id: 'gooverseas',
    name: 'Go Overseas — Teach Abroad',
    url: 'https://www.gooverseas.com/teaching-jobs-abroad',
    focus: 'Teaching positions and programs abroad',
    lastScraped: '2026-06-15',
    notes: 'Aggregates teaching programs. Many require physical relocation. Filter for online/remote-friendly programs.'
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely',
    url: 'https://weworkremotely.com/',
    focus: 'Remote jobs across all categories',
    lastScraped: '2026-06-15',
    notes: 'Premium remote job board. High-quality listings. Good source for analytics, AI, and tech roles. Fewer ESL positions.'
  },
  {
    id: 'remotive',
    name: 'Remotive',
    url: 'https://remotive.com/',
    focus: 'Remote jobs in tech, marketing, and more',
    lastScraped: '2026-06-15',
    notes: 'Curated remote job board. Good for data science, AI, and analytics roles.'
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    url: 'https://himalayas.app/',
    focus: 'Remote jobs with company transparency data',
    lastScraped: '2026-06-15',
    notes: 'Modern remote job board with company profiles and salary data. Useful for vetting.'
  },
  {
    id: 'actuarialcareers',
    name: 'Actuarial Careers / Insurance Job Boards',
    url: 'https://www.theactuaryjobs.com/',
    focus: 'Actuarial, insurance analytics, and cat modelling roles',
    lastScraped: '2026-06-15',
    notes: 'Niche board for insurance analytics. Cat modelling roles are rare and often require specific software (RMS, AIR). Remote worldwide positions exist but are uncommon.'
  }
];
