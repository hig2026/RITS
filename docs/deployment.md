# Turnkey hosting and preview

RITS is configured as a static site that can be previewed locally and deployed to GitHub Pages without paid services.

## Local preview

```bash
npm run preview
```

The command builds the deployable artifact into `dist/` and serves it at <http://127.0.0.1:4173/>.

## Automated GitHub Pages hosting

The repository includes `.github/workflows/pages.yml`, which:

1. runs on every push to `main`/`master` and from manual `workflow_dispatch` runs;
2. installs with `npm ci` from the committed lockfile;
3. runs the test suite;
4. builds the static artifact into `dist/`;
5. uploads the artifact to GitHub Pages; and
6. publishes the live site through the `github-pages` environment.

After the branch is pushed to GitHub, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The deployed URL appears in the workflow run summary and in the repository's Pages settings.

## Expected public URL format

For a normal project page, GitHub Pages serves the site at:

```text
https://<github-user-or-org>.github.io/<repository-name>/
```

For this repository name, the final path is expected to be:

```text
https://<github-user-or-org>.github.io/RITS/
```

## Why GitHub Pages

- It is free for public repositories.
- It does not require a paid database, server, or SaaS backend.
- It supports this dependency-light static app directly from CI.
- The app uses relative asset paths, so it works under a project-page subpath such as `/RITS/`.
