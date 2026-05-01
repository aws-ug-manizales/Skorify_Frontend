'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { tokens } from '@lib/theme/theme';
import MemberListItem from '../molecules/MemberListItem';
import type { GroupMember } from '../../types';

const MOBILE_PREVIEW_COUNT = 4;

interface MemberListProps {
  members: GroupMember[];
  currentUserId: string;
}

const MemberList = ({ members, currentUserId }: MemberListProps) => {
  const t = useTranslations('groups');
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMediaQuery('(min-width:900px)');

  const visibleMembers = !isDesktop && !expanded ? members.slice(0, MOBILE_PREVIEW_COUNT) : members;
  const hasMore = !isDesktop && members.length > MOBILE_PREVIEW_COUNT;

  return (
    <Box
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '16px',
        p: { xs: 2, md: 2.5 },
        boxShadow: tokens.shadowSm,
        ...(isDesktop && { position: 'sticky', top: 88 }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          cursor: !isDesktop ? 'pointer' : 'default',
          userSelect: 'none',
        }}
        onClick={!isDesktop ? () => setExpanded((e) => !e) : undefined}
      >
        <PeopleOutlineIcon sx={{ color: tokens.primary, fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{
            color: tokens.onSurface,
            flex: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {t('membersTitle')} ({members.length})
        </Typography>
        {!isDesktop && (
          <IconButton size="small" sx={{ color: tokens.onSurfaceVariant, pointerEvents: 'none' }}>
            {expanded ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {visibleMembers.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            isCurrentUser={member.id === currentUserId}
          />
        ))}
      </Box>

      {hasMore && (
        <Box
          sx={{ mt: 1.5, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setExpanded((e) => !e)}
        >
          <Typography variant="body2" sx={{ color: tokens.primary, fontWeight: 600 }}>
            {expanded
              ? t('showLess')
              : t('showMore', { count: members.length - MOBILE_PREVIEW_COUNT })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MemberList;
