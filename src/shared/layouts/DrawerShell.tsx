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
<<<<<<< HEAD
  const [manualExpandedKeys, setManualExpandedKeys] = useState<string[]>([]);
=======
  // Per-key manual override of the expanded state. When a key is present its
  // boolean wins over the "auto-expand because a child is active" default, so
  // clicking a parent always toggles its submenu — even the active one.
  const [expandedOverrides, setExpandedOverrides] = useState<Record<string, boolean>>({});
>>>>>>> origin/develop
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { isAdmin } = useAuthSession();
  const role: DrawerRole = isAdmin ? 'admin' : 'user';

  const drawerItems = useMemo(() => getDrawerItems(role), [role]);
<<<<<<< HEAD
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
=======

  const isExpanded = (key: string, hasActiveChild: boolean) =>
    key in expandedOverrides ? expandedOverrides[key] : hasActiveChild;

  const expandedKeys = useMemo(
    () =>
      drawerItems
        .filter((item) => item.children && isExpanded(item.key, !!activeChildKey(item, pathname)))
        .map((item) => item.key),
    // isExpanded reads expandedOverrides; listed explicitly so the memo recomputes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawerItems, pathname, expandedOverrides],
  );

  const toggleExpanded = (key: string) => {
    const item = drawerItems.find((current) => current.key === key);
    const hasActiveChild = !!(item && activeChildKey(item, pathname));
    setExpandedOverrides((prev) => ({ ...prev, [key]: !isExpanded(key, hasActiveChild) }));
>>>>>>> origin/develop
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
