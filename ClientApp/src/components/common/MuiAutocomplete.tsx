import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      paper: '#0f172a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    background: {
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
});

interface MuiAutocompleteProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  themeMode?: 'light' | 'dark';
  className?: string;
  minWidth?: string;
}

export const MuiAutocomplete: React.FC<MuiAutocompleteProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
  themeMode = 'dark',
  className,
  minWidth,
}) => {
  const safeOptions = Array.from(new Set(options.filter(Boolean)));
  const isLight = themeMode === 'light';
  const theme = isLight ? lightTheme : darkTheme;

  // Find exact or case-insensitive match
  const matchedValue = safeOptions.find((opt) => opt.trim().toLowerCase() === (value || '').trim().toLowerCase()) || value || '';

  // Ensure option is present in list if value exists
  const finalOptions = matchedValue && !safeOptions.includes(matchedValue) ? [matchedValue, ...safeOptions] : safeOptions;

  return (
    <ThemeProvider theme={theme}>
      <div className={className}>
        {label && (
          <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {label}
          </label>
        )}
        <Autocomplete
          options={finalOptions}
          value={matchedValue}
          onChange={(_, newValue) => onChange(newValue || '')}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === 'input') {
              onChange(newInputValue || '');
            }
          }}
          freeSolo
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder || label || 'Select option'}
              required={required}
              variant="outlined"
              sx={{
                minWidth: minWidth || '180px',
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.75rem',
                  color: isLight ? '#1e293b' : '#ffffff',
                  backgroundColor: isLight ? '#ffffff' : '#0f172a',
                  borderRadius: '0.375rem',
                  '& fieldset': {
                    borderColor: isLight ? '#cbd5e1' : 'rgba(51, 65, 85, 0.8)',
                  },
                  '&:hover fieldset': {
                    borderColor: isLight ? '#2563eb' : '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isLight ? '#2563eb' : '#6366f1',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '4px 8px !important',
                },
                '& .MuiSvgIcon-root': {
                  color: isLight ? '#64748b' : '#94a3b8',
                },
              }}
            />
          )}
        />
      </div>
    </ThemeProvider>
  );
};
