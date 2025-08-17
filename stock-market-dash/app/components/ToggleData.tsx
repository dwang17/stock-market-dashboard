import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const options = ['Historical', 'Predicted'];

type ToggleDataProps = {
    value: string;
    onChange: (newValue: string) => void;
};

export default function ToggleData({ value, onChange }: ToggleDataProps) {

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event: any, newValue: string | null) => {
          if (newValue) onChange(newValue);
        }}
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Data Type" />}
      />
    </div>
  );
}