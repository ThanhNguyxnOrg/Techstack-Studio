# Deployment

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml`. Every push
to `main` builds, tests, and publishes the production bundle; the workflow can also
be run manually from the Actions tab.

- Live URL: <https://thanhnguyxnorg.github.io/Techstack-Studio/>
- Workflow: <https://github.com/ThanhNguyxnOrg/Techstack-Studio/actions/workflows/deploy.yml>

## How it works

```text
push to main
  -> checkout
  -> Node 22 + npm cache
  -> npm ci
  -> typecheck
  -> tests
  -> vite build with VITE_BASE_PATH=/Techstack-Studio/
  -> upload dist as a Pages artifact
  -> deploy-pages publishes it
```

`actions/configure-pages` supplies `base_path`, so the workflow also works if the
repository is renamed or served from a user/org root site. `vite.config.ts` reads
`VITE_BASE_PATH` first, which keeps asset URLs correct under a subpath.

## First-time setup

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`, or run the deploy workflow manually.
5. Wait for the `github-pages` environment to report the URL.

Public repositories on the GitHub Free plan can use Pages. Private repositories
need a paid plan. The workflow needs `pages: write` and `id-token: write`, which are
already declared.

## Local production check

```bash
npm ci
npm run build
npm run preview
```

`npm run preview` serves the built site at `http://localhost:4173`. To reproduce the
GitHub Pages subpath locally:

```bash
# PowerShell
$env:VITE_BASE_PATH='/Techstack-Studio/'; npm run build; npm run preview

# bash
VITE_BASE_PATH=/Techstack-Studio/ npm run build && npm run preview
```

Open `http://localhost:4173/Techstack-Studio/`. If CSS or icons 404, the base path
and the URL you opened do not match.

## Manual deployment

```bash
gh workflow run deploy.yml --repo ThanhNguyxnOrg/Techstack-Studio
gh run watch --repo ThanhNguyxnOrg/Techstack-Studio
```

Or use **Actions → Deploy to GitHub Pages → Run workflow** in the browser.

## Forking or renaming

If you deploy your own copy, update the public URLs in these places:

| File                  | What to change                                                 |
| --------------------- | -------------------------------------------------------------- |
| `src/data/catalog.ts` | `GITHUB_REPO_URL`, `GITHUB_PAGES_URL`, `GITHUB_RAW_PUBLIC_URL` |
| `index.html`          | canonical URL and Open Graph/Twitter URLs                      |
| `public/robots.txt`   | sitemap URL                                                    |
| `public/sitemap.xml`  | page URL                                                       |
| `package.json`        | `homepage`, `repository`, `bugs`                               |
| `README.md`           | live demo, badges, and star-history links                      |
| `.github/CODEOWNERS`  | maintainer handle                                              |

The README assets in `docs/assets/` use relative paths, so they keep working on a
fork without changes.

## Custom domain

1. Add the domain in **Settings → Pages → Custom domain**.
2. Create the DNS records GitHub shows (usually a `CNAME` for `www` and `A`/`AAAA`
   records for the apex).
3. Enable **Enforce HTTPS** after DNS verification.
4. Optionally commit a `public/CNAME` file containing the bare domain so the setting
   survives redeployments.

With a custom domain, `base_path` becomes empty and the workflow builds with `/`.

## Troubleshooting

| Symptom                             | Likely cause                                | Fix                                              |
| ----------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| Deploy job fails at `deploy-pages`  | Pages source is not set to GitHub Actions   | Settings → Pages → Source: GitHub Actions        |
| Site loads but assets 404           | Wrong base path                             | Check `VITE_BASE_PATH` and the URL subpath       |
| Blank page with console MIME errors | `index.html` served from a stale deployment | Re-run the deploy workflow                       |
| Workflow cannot push Pages          | Missing `pages`/`id-token` permissions      | Keep the permissions block in `deploy.yml`       |
| Environment waiting for approval    | Protection rule on `github-pages`           | Approve the deployment or relax the rule         |
| Old content after a push            | CDN cache or a failed run                   | Check the latest workflow run, then hard-refresh |

The build is fully static, so no server, database, or environment variables are
required beyond the optional base path.
