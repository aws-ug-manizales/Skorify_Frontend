import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

type IconComponent = ComponentType<SvgIconProps>;

export type DrawerLeaf = { key: string; href: string; Icon: IconComponent };
export type DrawerItem = DrawerLeaf & { children?: ReadonlyArray<DrawerLeaf> };
export type DrawerRole = 'user' | 'admin';

// The raw matches list (`matchesList`) is admin-only; general users and
// managers only get predictions and results under the "matches" group.
const matchesChildren: ReadonlyArray<DrawerLeaf> = [
  { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
  { key: 'results', href: '/results', Icon: LeaderboardIcon },
];

const matchesAdminChildren: ReadonlyArray<DrawerLeaf> = [
  { key: 'matchesList', href: '/matches', Icon: CalendarMonthIcon },
  { key: 'results', href: '/results', Icon: LeaderboardIcon },
];

const buildBaseItems = (role: DrawerRole): ReadonlyArray<DrawerItem> => [
  { key: 'home', href: '/home', Icon: HomeIcon },
  {
    key: 'matches',
    href: '/matches',
    Icon: CalendarMonthIcon,
    children: role === 'admin' ? matchesAdminChildren : matchesChildren,
  },
  // Tournaments management is admin-only.
  ...(role === 'admin'
    ? [{ key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon } as DrawerItem]
    : []),
  { key: 'groups', href: '/groups', Icon: GroupIcon },
];

const adminItems: ReadonlyArray<DrawerItem> = [{ key: 'users', href: '/users', Icon: GroupIcon }];

export const getDrawerItems = (role: DrawerRole = 'user'): ReadonlyArray<DrawerItem> =>
  role === 'admin' ? [...buildBaseItems('admin'), ...adminItems] : buildBaseItems('user');

export const matchesPath = (href: string, pathname: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export const activeChildKey = (item: DrawerItem, pathname: string): string | null => {
  if (!item.children) return null;
  const matching = item.children.filter((c) => matchesPath(c.href, pathname));
  if (matching.length === 0) return null;
  return matching.reduce((a, b) => (b.href.length > a.href.length ? b : a)).key;
};
