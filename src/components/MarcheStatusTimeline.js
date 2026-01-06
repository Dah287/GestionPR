// src/components/MarcheStatusTimeline.js
import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ErrorIcon from '@mui/icons-material/Error';

const getPhaseStatus = (phase) => {
  if (phase.dateFinReelle) return 'done';
  if (new Date(phase.dateFinPrevue) < new Date()) return 'late';
  return 'active';
};

const statusConfig = {
  done: {
    color: 'success.main',
    icon: <CheckCircleIcon fontSize="small" />,
    label: 'Terminée',
  },
  active: {
    color: 'info.main',
    icon: <HourglassTopIcon fontSize="small" />,
    label: 'En cours',
  },
  late: {
    color: 'error.main',
    icon: <ErrorIcon fontSize="small" />,
    label: 'En retard',
  },
};

export const MarcheStatusTimeline = ({ marche }) => {
  if (!marche?.phases?.length) {
    return <Typography color="text.secondary">Aucune phase</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Avancement du marché
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          py: 2,
        }}
      >
        {marche.phases.map((phase, index) => {
          const status = getPhaseStatus(phase);
          const cfg = statusConfig[status];

          return (
            <Box
              key={phase.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Phase */}
              <Box textAlign="center" minWidth={180}>
                <Box
                  sx={{
                    mx: 'auto',
                    mb: 1,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: cfg.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cfg.icon}
                </Box>

                <Typography fontWeight="bold" variant="body2">
                  {phase.nom}
                </Typography>

                <Chip
                  label={cfg.label}
                  size="small"
                  sx={{ mt: 0.5 }}
                  color={
                    status === 'done'
                      ? 'success'
                      : status === 'late'
                      ? 'error'
                      : 'info'
                  }
                />
              </Box>

              {/* Ligne */}
              {index < marche.phases.length - 1 && (
                <Box
                  sx={{
                    height: 4,
                    width: 60,
                    bgcolor: 'divider',
                    mx: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
