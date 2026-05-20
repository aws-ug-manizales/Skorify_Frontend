import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import UploadFileIcon from '@mui/icons-material/UploadFile';

type IconComponent = ComponentType<SvgIconProps>;

export type DrawerLeaf = { key: string; href: string; Icon: IconComponent };
export type DrawerItem = DrawerLeaf & { children?: ReadonlyArray<DrawerLeaf> };
export type DrawerRole = 'user' | 'admin';

const matchesChildren: ReadonlyArray<DrawerLeaf> = [
  { key: 'matchesList', href: '/matches', Icon: CalendarMonthIcon },
  { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
  { key: 'results', href: '/results', Icon: LeaderboardIcon },
];

const matchesAdminChildren: ReadonlyArray<DrawerLeaf> = [
  { key: 'loadResults', href: '/matches/load-results', Icon: UploadFileIcon },
];

const buildBaseItems = (role: DrawerRole): ReadonlyArray<DrawerItem> => [
  { key: 'home', href: '/home', Icon: HomeIcon },
  {
    key: 'matches',
    href: '/matches',
    Icon: CalendarMonthIcon,
    children: role === 'admin' ? [...matchesChildren, ...matchesAdminChildren] : matchesChildren,
  },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
];

const adminItems: ReadonlyArray<DrawerItem> = [{ key: 'users', href: '/users', Icon: GroupIcon }];

export const getDrawerItems = (role: DrawerRole = 'user'): ReadonlyArray<DrawerItem> =>
  role === 'admin' ? [...buildBaseItems('admin'), ...adminItems] : buildBaseItems('user');

const excludesPrefixMatch = (pathname: string) => pathname === '/matches/load-results';

export const matchesPath = (href: string, pathname: string) =>
  pathname === href || (pathname.startsWith(`${href}/`) && !excludesPrefixMatch(pathname));

export const activeChildKey = (item: DrawerItem, pathname: string): string | null => {
  if (!item.children) return null;
  const matching = item.children.filter((c) => matchesPath(c.href, pathname));
  if (matching.length === 0) return null;
  return matching.reduce((a, b) => (b.href.length > a.href.length ? b : a)).key;
};
