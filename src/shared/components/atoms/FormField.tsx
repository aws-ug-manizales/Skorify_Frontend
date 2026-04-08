'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

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
};

const FormField = <T extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  options,
  children,
  ...textFieldProps
}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...textFieldProps}
        {...field}
        value={field.value ?? ''}
        error={!!error}
        helperText={error?.message ?? helperText}
        select={!!options || textFieldProps.select}
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

export default FormField;
