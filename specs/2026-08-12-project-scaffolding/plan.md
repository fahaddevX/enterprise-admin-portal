# Plan — Project Scaffolding

Numbered task groups in execution order. Complete each group before moving to the next.

1. **Repo foundation**
   - `git init` with a `.gitignore` covering Node, Next.js, and env files
   - Add `README.md` and `specs/` to the initial commit

2. **Next.js bootstrap**
   - Scaffold a new Next.js app with TypeScript using `pnpm create next-app`
   - Confirm the App Router is enabled
   - Delete boilerplate placeholder content

3. **Tailwind CSS setup**
   - Install and configure Tailwind CSS per the Next.js integration guide
   - Verify a utility class renders correctly on the default page

4. **Environment config**
   - Add `.env.example` with documented placeholder keys for DB, Redis, and CRM API
   - Add `.env.local` to `.gitignore`

5. **Linting and formatting**
   - Configure ESLint (Next.js defaults) and Prettier
   - Add a `lint` and `format` script to `package.json`
   - Enforce consistent import order

6. **Project structure**
   - Establish top-level directories: `app/`, `lib/`, `db/`, `workers/`, `components/`
   - Add a `tsconfig.json` path alias (`@/`) pointing to the project root
