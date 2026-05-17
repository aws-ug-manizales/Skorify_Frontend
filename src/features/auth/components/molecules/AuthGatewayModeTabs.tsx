'use client';

import type { SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

type Mode = 'login' | 'register';

interface AuthGatewayModeTabsProps {
  mode: Mode;
  loginLabel: string;
  registerLabel: string;
  onChange: (_: SyntheticEvent, value: Mode) => void;
}

const AuthGatewayModeTabs = ({
  mode,
  loginLabel,
  registerLabel,
  onChange,
}: AuthGatewayModeTabsProps) => (
  <Tabs centered value={mode} onChange={onChange}>
    <Tab label={loginLabel} value="login" />
    <Tab label={registerLabel} value="register" />
  </Tabs>
);

export default AuthGatewayModeTabs;
