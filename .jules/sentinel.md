## 2026-02-03 - Establishing Security Baseline with Disconnected History
**Vulnerability:** Lack of foundational security configuration (gitignore, security policy) in the main branch.
**Learning:** Establishing a security baseline in this repository required merging branches with unrelated histories. Using GitHub's Private Vulnerability Reporting in SECURITY.md avoids hardcoding sensitive contact information.
**Prevention:** Always initialize new repositories with a standard security baseline including a robust .gitignore and a clear vulnerability disclosure policy.

## 2026-02-04 - Enhancing Security Baseline and Gitignore Robustness
**Vulnerability:** Initial .gitignore was missing several common patterns for sensitive or temporary files (backups, swap files, detailed OS metadata, and test coverage), which could lead to accidental exposure of internal data.
**Learning:** A standard .gitignore should be as comprehensive as possible from the start to account for different development environments (e.g., Windows vs macOS, Vim vs VSCode) and tooling (e.g., test coverage reports).
**Prevention:** Use a battle-tested .gitignore template and supplement it with project-specific patterns. Regularly review .gitignore as new tools are added to the project.

## 2026-02-05 - Strengthening Defense in Depth for Secrets and Archives
**Vulnerability:** Potential for secret exposure through less common credential file patterns and accidental inclusion of sensitive files in source archives created via `git archive`.
**Learning:** Security posture can be improved by proactively blocking a wider range of credential patterns (e.g., service accounts, keystores) and using `.gitattributes` with `export-ignore` to ensure that even if a secret is accidentally tracked, it isn't included in distributed source bundles.
**Prevention:** Supplement `.gitignore` with broad secret patterns and maintain a `.gitattributes` file to control archive contents as part of a defense-in-depth strategy.
