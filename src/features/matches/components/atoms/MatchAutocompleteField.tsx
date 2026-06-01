'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export type MatchAutocompleteOption = {
  id: string;
  label: string;
};

type MatchAutocompleteFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  helperText?: string;
  options: MatchAutocompleteOption[];
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
};

const MatchAutocompleteField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  helperText,
  options,
  disabled,
  rules,
}: MatchAutocompleteFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => {
      const selectedOption = options.find((option) => option.id === field.value) ?? null;

      return (
        <Autocomplete<MatchAutocompleteOption, false, false, false>
          options={options}
          value={selectedOption}
          onChange={(_, option) => field.onChange(option?.id ?? '')}
          onBlur={field.onBlur}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.label}
          autoHighlight
          fullWidth
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
            />
          )}
        />
      );
    }}
  />
);

export default MatchAutocompleteField;
