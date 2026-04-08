# Sentinel Journal

## 2026-04-10 - Foundations of Repository Security
**Vulnerability:** Lack of initial security posture in a new repository allows for accidental disclosure of secrets and provides no guidance for vulnerability reporting.
**Learning:** Establishing a security baseline (gitignore, security policy, private manifest) is a critical preventive measure that must be focused and avoid "security theater" like mock test scripts.
**Prevention:** Always initialize new repositories with a robust .gitignore and a SECURITY.md, while ensuring all configurations are functional and non-placeholder.
