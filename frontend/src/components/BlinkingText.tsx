import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

interface BlinkingTextProps {
  children: React.ReactNode;
  blinkColor?: string;
  normalColor?: string;
  duration?: number;
  delay?: number;
}

const blinkAnimation = keyframes`
  0%, 40% {
    opacity: 1;
    visibility: visible;
  }
  50%, 90% {
    opacity: 0;
    visibility: hidden;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
`;

const BlinkingText: React.FC<BlinkingTextProps> = ({ 
  children, 
  blinkColor = '#6A1B9A', 
  normalColor = '#6A1B9A',
  duration = 1.2,
  delay = 0
}) => {
  return (
    <Box
      component="span"
      sx={{
        color: normalColor,
        animation: `${blinkAnimation} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        '&:hover': {
          color: blinkColor,
          animation: 'none',
          opacity: 1,
          visibility: 'visible',
        }
      }}
    >
      {children}
    </Box>
  );
};

export default BlinkingText;
