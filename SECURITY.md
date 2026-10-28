# Security Policy

## Supported versions

Tech Stack Studio is a static, browser-only application. Security fixes are applied
to the latest release on `main` and the deployed site.

| Version | Supported |
| ------- | --------- |
| `1.x`   | Yes       |
| Older   | No        |

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Use GitHub's private vulnerability reporting:

1. Go to the [Security tab](https://github.com/ThanhNguyxnOrg/Techstack-Studio/security).
2. Select **Report a vulnerability**.
3. Include the affected page, browser, reproduction steps, and impact.

If private reporting is unavailable, contact [@RealThanhNguyxn](https://github.com/RealThanhNguyxn)
directly on GitHub and ask for a private channel.

You can expect an acknowledgement within **3 business days** and a triage decision
within **7 business days**. Please allow time for a fix before public disclosure.

## Scope

In scope:

- Cross-site scripting or HTML/SVG injection through exported Markdown, HTML, or SVG
- Malicious SVG assets in the catalog (scripts, event handlers, external loads)
- Dependency vulnerabilities that affect the built site
- Supply-chain problems in the build or GitHub Actions workflows
- Privacy leaks: the app is local-only today, so any unexpected network request that
  contains user selections is a bug

Out of scope:

- Missing security headers on GitHub Pages infrastructure
- Issues that require a compromised browser, extension, or local machine
- Social engineering
- Denial of service against GitHub Pages
- Trademark or brand-usage disputes (see [ATTRIBUTION.md](ATTRIBUTION.md))

## Security model

- There is no backend, database, authentication, or telemetry.
- Selections and settings are stored in `localStorage` and never uploaded.
- All logo assets are committed static files served from the same origin.
- User-controlled labels and titles are HTML-escaped before they are placed in
  Markdown, HTML, or SVG exports.
- The asset-integrity suite rejects scripts, `foreignObject`, raster embeds, inline
  event handlers, `javascript:` URLs, and external runtime references in every
  generated SVG.
- Dependencies are installed with a committed lockfile and audited by CI and
  Dependabot.

## Safe harbor

We will not pursue legal action against researchers who make a good-faith effort to
follow this policy, avoid privacy violations and data destruction, and give us a
reasonable window to fix the issue before disclosure.
