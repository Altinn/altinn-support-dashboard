// src/pages/SignOutPage.tsx

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const SignOutPage: React.FC = () => {
    const handleLoginAgain = () => {
        window.location.href = '/';
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                textAlign: 'center',
                p: 2,
            }}
        >
            <LogoutIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Du har logget ut
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Du er nå trygt utlogget. Vi sees snart igjen!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LoginIcon />}
                onClick={handleLoginAgain}
                sx={{
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    boxShadow: 3,
                }}
            >
                Logg inn igjen
            </Button>
        </Container>
    );
};

export default SignOutPage;
