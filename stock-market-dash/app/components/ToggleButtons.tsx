import * as React from 'react';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
// import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
// import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type ToggleButtonsProps = {
    value: string | null;
    onChange: (newValue: string) => void;
};

export default function ToggleButtons({ value, onChange }: ToggleButtonsProps) {
  
  const handleTimeType = (
    event: React.MouseEvent<HTMLElement>,
    newTimeType: string | null,
  ) => {
    if (newTimeType) onChange(newTimeType);
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleTimeType}
      aria-label="time type"
    >
      <ToggleButton value="day" aria-label="days">
        DAY
      </ToggleButton>
      <ToggleButton value="week" aria-label="weeks">
        WEEK
      </ToggleButton>
      <ToggleButton value="month" aria-label="months">
        MONTH
      </ToggleButton>
      <ToggleButton value="year" aria-label="years">
        YEAR
      </ToggleButton>
    </ToggleButtonGroup>
  );
}