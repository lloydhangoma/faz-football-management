# Admin Seed Script

This project includes a convenient script to create or reset an admin user in your database.

Usage (from `backend-faz` directory):

- Create a new admin (default values shown):
  ```bash
  node seed-admin.cjs admin@fazreg.online StrongPassword123!
  ```

- Create a content editor account (recommended for CMS editors):
  ```bash
  node seed-admin.cjs editor@fazreg.online EditorPass123! "Content Editor"
  ```
  or with npm script:
  ```bash
  npm run seed-admin -- editor@fazreg.online EditorPass123! "Content Editor"
  ```
  If the user exists, add `--force` to update the password (e.g., `node seed-admin.cjs editor@fazreg.online NewPass --force`).

- Use environment variables instead of args:
  ```bash
  SEED_ADMIN_EMAIL=admin@fazreg.online SEED_ADMIN_PASSWORD=StrongPass node seed-admin.cjs
  ```

- Update existing admin password:
  ```bash
  node seed-admin.cjs admin@fazreg.online NewPass --force
  ```

Notes:
- The script reads `MONGO_URI` from your `.env` when available.
- Avoid using weak passwords in production; rotate credentials after initial setup.

Local development tips:
- If you don't run Redis locally, set `DISABLE_TRANSFER_WORKER=1` in your environment to disable background workers that require Redis, or run Redis via Docker:

```bash
# disable workers
DISABLE_TRANSFER_WORKER=1 npm run dev

# or run redis in docker
docker run -p 6379:6379 -d redis:7
```

