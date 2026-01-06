// src/components/MarcheStatusView.js
import React from 'react';
import { Box, Alert, Paper, Typography } from '@mui/material';
import { MarcheStatusTimeline } from './MarcheStatusTimeline';

export const MarcheStatusView = ({
  marche,
  error,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : marche ? (
        <>
          {/* Infos marché */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Marché #{marche.numero.replace('-', '/')}
            </Typography>
            <Typography color="text.secondary">
              Type : {marche.type}
            </Typography>
          </Paper>

          {/* Timeline moderne */}
          <MarcheStatusTimeline marche={marche} />
        </>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Sélectionnez un marché à gauche
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
