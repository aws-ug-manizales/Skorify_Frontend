import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

type IconComponent = ComponentType<SvgIconProps>;

export type DrawerLeaf = { key: string; href: string; Icon: IconComponent };
export type DrawerItem = DrawerLeaf & { children?: ReadonlyArray<DrawerLeaf> };
export type DrawerRole = 'user' | 'admin';

const baseItems: ReadonlyArray<DrawerItem> = [
  { key: 'home', href: '/home', Icon: HomeIcon },
  {
    key: 'matches',
    href: '/matches',
    Icon: CalendarMonthIcon,
    children: [
      { key: 'matchesList', href: '/matches', Icon: CalendarMonthIcon },
      { key: 'predictions', href: '/predictions', Icon: SportsSoccerIcon },
    ],
  },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
];

const adminItems: ReadonlyArray<DrawerItem> = [
  { key: 'admin', href: '/admin', Icon: WorkspacePremiumIcon },
  { key: 'users', href: '/users', Icon: GroupIcon },
  { key: 'loadResults', href: '/matches/load-results', Icon: UploadFileIcon },
];

export const getDrawerItems = (role: DrawerRole = 'user'): ReadonlyArray<DrawerItem> =>
  role === 'admin' ? [...baseItems, ...adminItems] : baseItems;

const excludesPrefixMatch = (pathname: string) => pathname === '/matches/load-results';

export const matchesPath = (href: string, pathname: string) =>
  pathname === href || (pathname.startsWith(`${href}/`) && !excludesPrefixMatch(pathname));

export const activeChildKey = (item: DrawerItem, pathname: string): string | null => {
  if (!item.children) return null;
  const matching = item.children.filter((c) => matchesPath(c.href, pathname));
  if (matching.length === 0) return null;
  return matching.reduce((a, b) => (b.href.length > a.href.length ? b : a)).key;
};
