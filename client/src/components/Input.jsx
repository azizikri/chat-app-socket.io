/* eslint-disable react/prop-types */
import { TextField } from '@mui/material';

export default function Input({ label, value, onChange }) {
    return (
            <TextField
              type="text"
              label={label}
              value={value}
              onChange={onChange}
              size='small'
              style={{ marginRight: '1vh', marginBottom: '1vh' }}
            />
          );
  }
