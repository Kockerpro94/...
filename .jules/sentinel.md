## 2026-02-03 - Establishing Security Baseline with Disconnected History
**Vulnerability:** Lack of foundational security configuration (gitignore, security policy) in the main branch.
**Learning:** Establishing a security baseline in this repository required merging branches with unrelated histories. Using GitHub's Private Vulnerability Reporting in SECURITY.md avoids hardcoding sensitive contact information.
**Prevention:** Always initialize new repositories with a standard security baseline including a robust .gitignore and a clear vulnerability disclosure policy.

## 2026-02-04 - Enhancing Security Baseline and Gitignore Robustness
**Vulnerability:** Initial .gitignore was missing several common patterns for sensitive or temporary files (backups, swap files, detailed OS metadata, and test coverage), which could lead to accidental exposure of internal data.
**Learning:** A standard .gitignore should be as comprehensive as possible from the start to account for different development environments (e.g., Windows vs macOS, Vim vs VSCode) and tooling (e.g., test coverage reports).
**Prevention:** Use a battle-tested .gitignore template and supplement it with project-specific patterns. Regularly review .gitignore as new tools are added to the project.
