# Development rules

These rules apply to every contributor and AI coding tool working on DevDocs.

## Workflow

1. Read `docs/README.md`, then the relevant architecture, schema, and migration documents before making a change.
2. Work on exactly one migration-plan milestone at a time.
3. State the files to change, implement the smallest complete change, and run its relevant checks.
4. Report what changed, what was verified, and what the next milestone is.
5. Update `docs/migration-plan.md` when a milestone is finished or its scope changes.

## Safety and scope

- Do not delete Supabase files, credentials, or data until the replacement has been tested and the data has been exported or intentionally discarded.
- Do not add Supabase or another backend-as-a-service as a shortcut.
- Do not expose database URLs, database credentials, password hashes, session tokens, or server-only environment variables to browser code.
- Do not make unrelated visual redesigns during the platform migration.
- Do not install, remove, or upgrade packages without explaining why the package is needed.
- Do not overwrite existing user changes or use destructive Git commands without explicit approval.

## Code rules

- Use TypeScript for all newly created or migrated application code.
- Keep server-only database and authentication code outside client components.
- Validate input on the server for every mutation.
- Authorize every record read or mutation using the current session; UI checks alone are insufficient.
- Use meaningful names and small modules. Avoid duplicate API wrappers and duplicate auth state listeners.
- Keep database migrations committed to the repository and review generated SQL before applying it.

## Authentication rules

- Hash passwords with Argon2id; never encrypt or store plaintext passwords.
- Use secure, HTTP-only, same-site session cookies.
- Store hashed session tokens in the database and expire sessions.
- Return safe, user-friendly authentication errors without revealing sensitive internals.

## Definition of done

A milestone is done only when the feature works locally, its relevant automated checks pass, and no prior feature has been broken.
