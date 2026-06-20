import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '4173';
const server = spawn('python3', ['-m', 'http.server', port, '--directory', 'dist'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await wait(1000);
  const response = await fetch(`http://127.0.0.1:${port}/`);
  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Expected 200 response, received ${response.status}`);
  }

  const requiredMarkers = [
    'RITS Jobs',
    'Curated jobs for globally mobile Indian applicants.',
    'src/app.js'
  ];

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      throw new Error(`Missing homepage marker: ${marker}`);
    }
  }

  const appResponse = await fetch(`http://127.0.0.1:${port}/src/app.js`);
  if (!appResponse.ok) {
    throw new Error(`Expected app module to be served, received ${appResponse.status}`);
  }

  console.log(`Smoke check passed at http://127.0.0.1:${port}/`);
} finally {
  server.kill();
}
