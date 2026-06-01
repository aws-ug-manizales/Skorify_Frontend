'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import DrawerNavigationList from './DrawerNavigationList';
import { getDrawerItems, type DrawerRole, activeChildKey } from './drawerItems';

export const BOTTOM_NAV_HEIGHT = 64;

const DrawerShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  const [manualExpandedKeys, setManualExpandedKeys] = useState<string[]>([]);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { isAdmin } = useAuthSession();
  const role: DrawerRole = isAdmin ? 'admin' : 'user';

  const drawerItems = useMemo(() => getDrawerItems(role), [role]);
  const activeExpandedKeys = useMemo(
    () =>
      drawerItems
        .filter((item) => item.children && activeChildKey(item, pathname))
        .map((item) => item.key),
    [drawerItems, pathname],
  );
  const expandedKeys = useMemo(
    () => Array.from(new Set([...manualExpandedKeys, ...activeExpandedKeys])),
    [manualExpandedKeys, activeExpandedKeys],
  );

  const toggleExpanded = (key: string) => {
    setManualExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((current) => current !== key) : [...prev, key],
    );
  };

  return (
    <DrawerNavigationList
      items={drawerItems}
      open={open}
      onToggleOpen={() => setOpen((current) => !current)}
      pathname={pathname}
      expandedKeys={expandedKeys}
      onToggleExpanded={toggleExpanded}
      t={t}
    >
      {children}
    </DrawerNavigationList>
  );
};

export default DrawerShell;
