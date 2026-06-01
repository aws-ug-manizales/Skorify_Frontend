'use client';

import { useRef } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';

export type UploadFileProps = Omit<IconButtonProps, 'onChange' | 'onSelect' | 'children'> & {
  accept?: string;
  multiple?: boolean;
  onSelect: (files: File[]) => void;
  children: ReactNode;
};

const UploadFile = ({
  accept,
  multiple = false,
  disabled = false,
  onSelect,
  onClick,
  children,
  ...iconButtonProps
}: UploadFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onSelect(Array.from(files));
    e.target.value = '';
  };

  return (
    <>
      <IconButton
        {...iconButtonProps}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          inputRef.current?.click();
        }}
      >
        {children}
      </IconButton>
      <Box
        component="input"
        type="file"
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        sx={{ display: 'none' }}
      />
    </>
  );
};

export default UploadFile;
