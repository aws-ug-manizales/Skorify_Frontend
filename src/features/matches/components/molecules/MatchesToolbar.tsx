'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  teamValue: string;
  onTeamChange: (value: string) => void;
  teamPlaceholder: string;

  weekValue: string; // '' | '01'..'12'
  onMonthChange: (value: string) => void;
  monthLabel: string;
  monthAllLabel: string;
  monthOptions: Array<{ value: string; label: string }>;

  clearLabel: string;
  onClear: () => void;
};

const MatchesToolbar = ({
  teamValue,
  onTeamChange,
  teamPlaceholder,
  weekValue,
  onMonthChange,
  monthLabel,
  monthAllLabel,
  monthOptions,
  clearLabel,
  onClear,
}: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 1.5,
      mb: 3,
      alignItems: { xs: 'stretch', md: 'center' },
      justifyContent: 'space-between',
    }}
  >
    <TextField
      value={teamValue}
      onChange={(e) => onTeamChange(e.target.value)}
      placeholder={teamPlaceholder}
      size="small"
      sx={{ flex: 1, minWidth: { xs: 'unset', md: 380 } }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: '1.1rem' }} />
            </InputAdornment>
          ),
          endAdornment: teamValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onTeamChange('')} aria-label={clearLabel}>
                <ClearIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />

    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: { xs: 'unset', md: 220 } }}>
        <InputLabel id="matches-month-label">{monthLabel}</InputLabel>
        <Select
          labelId="matches-month-label"
          value={weekValue}
          label={monthLabel}
          onChange={(e: SelectChangeEvent<string>) => onMonthChange(e.target.value)}
        >
          <MenuItem value="">{monthAllLabel}</MenuItem>
          {monthOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {(teamValue || weekValue) && (
        <IconButton onClick={onClear} aria-label={clearLabel} size="small">
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  </Box>
);

export default MatchesToolbar;
