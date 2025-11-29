# Switch from Cookies Auth to Sanctum Auth

## Backend Changes

- [x] Update AuthenticatedSessionController to use Sanctum for login/logout
- [x] Update API routes to use auth:sanctum middleware for protected routes
- [x] Ensure User model has HasApiTokens (already done)

## Frontend Changes

- [x] Update Context to manage auth token
- [x] Update Login component to store token on successful login
- [x] Update AdminPanel to include auth token in requests
- [x] Update Cart component to include auth token if needed
- [x] Add logout functionality

## Testing

- [x] Test login flow
- [x] Test protected routes
- [x] Test logout
