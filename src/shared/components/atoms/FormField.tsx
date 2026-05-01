'use client';

import { useState } from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export type FormFieldOption = {
  label: string;
  value: string | number;
};

type FormFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'error' | 'helperText'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  helperText?: string;
  options?: FormFieldOption[];
  showPasswordToggleAriaLabel?: string;
  hidePasswordToggleAriaLabel?: string;
};

const FormField = <T extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  options,
  children,
  type,
  slotProps,
  showPasswordToggleAriaLabel = 'Show password',
  hidePasswordToggleAriaLabel = 'Hide password',
  ...textFieldProps
}: FormFieldProps<T>) => {
  const isPassword = type === 'password';
  const [revealed, setRevealed] = useState(false);
  const resolvedType = isPassword && revealed ? 'text' : type;

  const passwordSlotProps = isPassword
    ? {
        ...slotProps,
        input: {
          ...(slotProps?.input ?? {}),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={revealed ? hidePasswordToggleAriaLabel : showPasswordToggleAriaLabel}
                onClick={() => setRevealed((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                size="small"
                tabIndex={-1}
              >
                {revealed ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }
    : slotProps;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...textFieldProps}
          {...field}
          type={resolvedType}
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message ?? helperText}
          select={!!options || textFieldProps.select}
          slotProps={passwordSlotProps}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          {children}
        </TextField>
      )}
    />
  );
};

export default FormField;
