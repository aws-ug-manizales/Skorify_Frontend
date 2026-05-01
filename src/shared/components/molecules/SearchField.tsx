'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

type SearchFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'select'
> & {
  name: Path<T>;
  control: Control<T>;
  clearAriaLabel?: string;
};

const SearchField = <T extends FieldValues>({
  name,
  control,
  clearAriaLabel = 'Clear search',
  size = 'small',
  slotProps,
  ...rest
}: SearchFieldProps<T>) => {
  const { field } = useController({ name, control });
  const value = (field.value as string | undefined) ?? '';

  return (
    <TextField
      {...rest}
      {...field}
      value={value}
      size={size}
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: '1.1rem' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label={clearAriaLabel}
                onClick={() => field.onChange('')}
                edge="end"
              >
                <ClearIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
          ...(slotProps?.input ?? {}),
        },
      }}
    />
  );
};

export default SearchField;
