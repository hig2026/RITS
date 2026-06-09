export const authRoadmap = {
  currentMode: 'anonymous',
  futureCapabilities: [
    'optional email/password or passkey sign-in',
    'saved jobs and hidden jobs',
    'reviewer roles for listing moderation',
    'applicant notes stored only with explicit consent'
  ]
};

export function getSession() {
  return {
    isAuthenticated: false,
    role: 'visitor',
    features: ['browse', 'filter', 'open-source-link']
  };
}
