// Set on a successful login; the dashboard consumes (and clears) it to run the
// guided tour right after the user signs in. Kept in its own module so callers
// (e.g. auth) don't pull driver.js into their bundle just for the constant.
export const TOUR_LOGIN_FLAG = 'skorify.runTourOnLogin';
