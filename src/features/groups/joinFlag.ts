// Carries an invite code across the login/registration redirect: a guest who
// opens a `/join/<code>` link is sent to `/auth`, and once authenticated the
// dashboard reads this to auto-open the join dialog with the code prefilled.
//
// sessionStorage (not just the query param) is the source of truth because the
// OAuth roundtrip through Cognito drops arbitrary query params — but tab-scoped
// sessionStorage survives it. Kept in its own module so callers (e.g. auth)
// don't pull the whole groups feature in just for the constant.
export const PENDING_JOIN_CODE_KEY = 'skorify.pendingJoinCode';

// Query param used on the `/auth` URL so the redirect is also deep-linkable.
export const JOIN_CODE_PARAM = 'joinCode';
