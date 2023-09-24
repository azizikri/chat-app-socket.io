/* eslint-disable react/prop-types */
import { Button } from '@mui/material';

export default function ButtonComponent({ text, onClick }) {
    return (
          <Button onClick={onClick} size='medium' variant='contained'>
            {text}
          </Button>
          );
  }
