'use client';

import { DashboardHome, UserDashboardHome } from '@features/dashboard';

// TODO: Replace with real user role check from session/profile.
const IS_ADMIN = false;

const DashboardHomePage = () => (IS_ADMIN ? <DashboardHome /> : <UserDashboardHome />);

export default DashboardHomePage;
