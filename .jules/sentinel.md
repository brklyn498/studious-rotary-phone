## 2025-12-23 - [Privilege Escalation in Mock Logic]
**Vulnerability:** The `INNVerificationView` in `apps.accounts` contained a mock implementation that accepted *any* 9-digit INN and verified the user as a "Business" account.
**Learning:** Mock implementations often prioritize convenience (accepting anything) over security, which can be dangerous if the mock logic leaks into environments where security testing occurs, or if developers rely on it and assume validation is happening elsewhere. Even mocks should fail securely by default.
**Prevention:** Always implement "allowlists" for mocks instead of "allow all". Ensure mocks return errors for unknown inputs, mirroring the behavior of real strict APIs.
