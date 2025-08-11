# Admin Authentication

The application uses a simple authentication system based on environment variables.

## Credentials

The admin credentials (email and password) are stored in the `.env` and `.env.local` files.

```
ADMIN_EMAIL=admin@aquavn.com
ADMIN_PASSWORD=admin123
```

## Login

The login page is located at `/admin/login`. The system uses a simple JWT-based session management.