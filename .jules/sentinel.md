# Sentinel Journal

## 2025-05-15 - Security Baseline PR Size Management
**Vulnerability:** Not a direct vulnerability, but a process risk where establishing a full security baseline can exceed the 50-line PR limit.
**Learning:** Bundling multiple security configuration files in a single PR makes it harder to review and can violate project constraints.
**Prevention:** Trim comments or less common patterns from meta-files like .gitignore to keep the total PR size under the 50-line limit.
