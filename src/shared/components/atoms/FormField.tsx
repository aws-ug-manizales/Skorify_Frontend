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
  /** Key del formulario — tipado contra el schema T */
  name: Path<T>;
  /** Control de react-hook-form */
  control: Control<T>;
  /** Reglas de validación de react-hook-form */
  rules?: RegisterOptions<T, Path<T>>;
  /** Texto de ayuda cuando no hay error */
  helperText?: string;
  /** Opciones para campos tipo select */
  options?: FormFieldOption[];
};

/**
 * Atom: FormField
 *
 * Campo de formulario genérico y totalmente parametrizable.
 * Combina MUI TextField con react-hook-form Controller.
 *
 * Uso:
 * ```tsx
 * <FormField<LoginForm>
 *   name="email"
 *   control={control}
 *   label="Correo electrónico"
 *   type="email"
 *   rules={{ required: 'El correo es obligatorio' }}
 *   fullWidth
 * />
 * ```
 */
export default function FormField<T extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  options,
  children,
  ...textFieldProps
}: FormFieldProps<T>) {
  return (
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
}
