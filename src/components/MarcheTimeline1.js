// src/components/MarcheTimeline.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Avatar,
  Stack,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle, FiPlus, FiTarget, FiInfo } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Autocomplete } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { MarcheService } from '../components/service';

// ----- Fonctions utilitaires -----
const getJoursRestants = (dateFinPrevue) => {
  const today = new Date();
  const fin = new Date(dateFinPrevue);
  const diffTime = fin.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (isoDate) => {
  return format(new Date(isoDate), 'dd/MM/yyyy', { locale: fr });
};

const getStatusColor = (isEnRetard, isARisque, jours) => {
  if (isEnRetard) return 'error.main';
  if (isARisque) return 'warning.main';
  return 'success.main';
};

const getStatusIcon = (isEnRetard, isARisque) => {
  if (isEnRetard) return <FiXCircle size={14} />;
  if (isARisque) return <FiAlertTriangle size={14} />;
  return <FiClock size={14} />;
};

const getStatusChip = (isEnRetard, isARisque, jours, realisee) => {
  if (realisee) {
    return (
      <Chip
        icon={<FiCheckCircle size={14} />}
        label="Réalisée"
        size="small"
        color="success"
        variant="filled"
      />
    );
  }
  if (isEnRetard) {
    return (
      <Chip
        icon={<FiXCircle size={14} />}
        label="En retard"
        size="small"
        color="error"
        variant="outlined"
      />
    );
  }
  if (isARisque) {
    return (
      <Chip
        icon={<FiAlertTriangle size={14} />}
        label="À risque"
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  }
  return (
    <Chip
      icon={<FiClock size={14} />}
      label="À venir"
      size="small"
      color="info"
      variant="outlined"
    />
  );
};

// ----- Composant Timeline Horizontale par Phase -----
const MarcheTimelineVisual = ({ marche, onMarkEtapeRealisee }) => {
  const displayNumero = marche.numero.replace('-', '/');

  // Tri des phases par date de début croissante
  const sortedPhases = [...(marche.phases || [])].sort((a, b) =>
    new Date(a.dateDebut) - new Date(b.dateDebut)
  );

  // Calculer les dates min/max pour l'échelle
  const allDates = [];
  sortedPhases.forEach(phase => {
    allDates.push(new Date(phase.dateDebut));
    allDates.push(new Date(phase.dateFinPrevue));
    phase.etapes?.forEach(etape => {
      allDates.push(new Date(etape.datePrevue));
    });
  });

  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

  // Étendue totale en jours
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

  // Fonction pour convertir une date en position % sur la timeline
  const getDatePosition = (date) => {
    const daysFromStart = Math.ceil((new Date(date) - minDate) / (1000 * 60 * 60 * 24));
    return (daysFromStart / totalDays) * 100;
  };

  // Statut global du marché
  const today = new Date();

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        p: 3,
        height: 'fit-content',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
        Marché <Box component="span" color="primary.main">#{displayNumero}</Box> • {marche.type}
      </Typography>

      {/* Titre de la timeline */}
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Chronologie des phases et étapes
      </Typography>

      {/* Ligne principale horizontale */}
      <Box
        sx={{
          position: 'relative',
          height: 80,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.default',
          overflow: 'hidden',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          px: 2,
        }}
      >
        {/* Ligne centrale */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            bgcolor: 'grey.300',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />

        {/* Point d'aujourd'hui */}
{/* Point d'aujourd'hui + Flèche vers le haut + Label "Aujourd’hui" */}
{today >= minDate && today <= maxDate && (
  <Tooltip title={`Aujourd'hui : ${formatDate(today)}`} arrow>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: `${getDatePosition(today)}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {/* Flèche vers le haut */}
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '8px solid',
          borderColor: 'primary.main',
          mb: 0.5,
        }}
      />
      {/* Avatar avec cible */}
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          width: 28,
          height: 28,
          '&:hover': { scale: 1.2 },
        }}
      >
        <FiTarget size={16} color="white" />
      </Avatar>
      {/* Label "Aujourd’hui" en dessous */}
      {/* <Typography
        variant="caption"
        fontWeight="bold"
        sx={{
          mt: 0.5,
          bgcolor: 'primary.main',
          color: 'white',
          px: 1,
          py: 0.25,
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          boxShadow: 1,
        }}
      >
       .
      </Typography> */}
    </Box>
  </Tooltip>
)}

        {/* Phases et leurs étapes */}
        {sortedPhases.map((phase, index) => {
          const debutPos = getDatePosition(phase.dateDebut);
          const finPos = getDatePosition(phase.dateFinPrevue);
          const jours = getJoursRestants(phase.dateFinPrevue);
          const isEnRetard = new Date(phase.dateFinPrevue) < today && !phase.dateFinReelle;
          const isARisque = !isEnRetard && jours >= 0 && jours <= 7;
          const bgColor = getStatusColor(isEnRetard, isARisque, jours);

          // Position du nom de la phase
          const phaseNamePos = (debutPos + finPos) / 2;

          return (
            <React.Fragment key={phase.id}>
              {/* Barre de phase */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: `${debutPos}%`,
                  width: `${finPos - debutPos}%`,
                  height: 8,
                  bgcolor: bgColor,
                  borderRadius: 4,
                  transform: 'translateY(-50%)',
                  zIndex: 5,
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />

              {/* Nom de la phase au-dessus */}
              <Tooltip title={`${phase.nom} (${formatDate(phase.dateDebut)} → ${formatDate(phase.dateFinPrevue)})`}>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: `${phaseNamePos}%`,
                    transform: 'translateX(-50%)',
                    bgcolor: 'background.paper',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: bgColor,
                    border: `1px solid ${bgColor}`,
                  }}
                >
                  {phase.nom}
                </Typography>
              </Tooltip>

              {/* Étapes */}
              {phase.etapes?.map((etape) => {
                const etapePos = getDatePosition(etape.datePrevue);
                const etapeColor = etape.realisee ? 'success.main' : 'grey.400';
                const isEnRetardEtape = new Date(etape.datePrevue) < today && !etape.realisee;
                const isARisqueEtape = !isEnRetardEtape && getJoursRestants(etape.datePrevue) <= 7;

                return (
                  <Tooltip
                    key={etape.id}
                    title={
                      <>
                        <strong>{etape.libelle}</strong>
                        <br />
                        Prévue : {formatDate(etape.datePrevue)}
                        {etape.realisee && ' • Réalisée'}
                      </>
                    }
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: `${etapePos}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: etapeColor,
                        border: etape.realisee ? '2px solid white' : '1px solid grey',
                        cursor: !etape.realisee ? 'pointer' : 'default',
                        zIndex: 6,
                        '&:hover': {
                          scale: 1.3,
                          boxShadow: '0 0 6px 2px rgba(0,0,0,0.1)',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => !etape.realisee && onMarkEtapeRealisee(etape.id)}
                    >
                      {!etape.realisee ? (
                        <IconButton
                          size="small"
                          sx={{
                            p: 0,
                            color: 'white',
                            '&:hover': { bgcolor: 'transparent' },
                          }}
                        >
                          <RadioButtonUncheckedIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <CheckCircleIcon fontSize="small" color="white" />
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* Échelle de dates en bas */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            px: 1,
            py: 0.5,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatDate(minDate)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(maxDate)}
          </Typography>
        </Box>
      </Box>

      {/* Légende */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Chip
          icon={<FiClock size={14} />}
          label="À venir"
          size="small"
          color="info"
          variant="outlined"
        />
        <Chip
          icon={<FiAlertTriangle size={14} />}
          label="À risque"
          size="small"
          color="warning"
          variant="outlined"
        />
        <Chip
          icon={<FiXCircle size={14} />}
          label="En retard"
          size="small"
          color="error"
          variant="outlined"
        />
        <Chip
          icon={<FiCheckCircle size={14} />}
          label="Réalisée"
          size="small"
          color="success"
          variant="filled"
        />
      </Stack>

      {/* Détails des phases */}
      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
        Détails des phases :
      </Typography>
      <List dense>
        {sortedPhases.map((phase) => {
          const jours = getJoursRestants(phase.dateFinPrevue);
          const isEnRetard = new Date(phase.dateFinPrevue) < today && !phase.dateFinReelle;
          const isARisque = !isEnRetard && jours >= 0 && jours <= 7;
          const nonRealisees = phase.etapes?.filter(e => !e.realisee).length || 0;

          return (
            <ListItem
              key={phase.id}
              disableGutters
              sx={{
                py: 1.5,
                bgcolor: isEnRetard
                  ? 'error.lighter'
                  : isARisque
                  ? 'warning.lighter'
                  : 'success.lighter',
                borderRadius: 1,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(isEnRetard, isARisque, jours),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  {getStatusIcon(isEnRetard, isARisque)}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="bold">
                    {phase.nom}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(phase.dateDebut)} → {formatDate(phase.dateFinPrevue)}
                  </Typography>
                }
              />
              <Box>
                {nonRealisees > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    {nonRealisees} à faire
                  </Button>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

// ----- Composant principal -----
export const MarcheTimeline1 = () => {
  const [marches, setMarches] = useState([]);
  const [selectedMarcheId, setSelectedMarcheId] = useState(null);
  const [marche, setMarche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateMarche, setShowCreateMarche] = useState(false);
  const [showCreatePhase, setShowCreatePhase] = useState(false);
  const [showCreateEtape, setShowCreateEtape] = useState(false);

  // --- Chargement initial ---
  useEffect(() => {
    const init = async () => {
      try {
        const allMarches = await MarcheService.getAllMarches();
        setMarches(allMarches);
        if (allMarches.length > 0) {
          const firstId = allMarches[0].numero;
          setSelectedMarcheId(firstId);
          loadMarcheDetail(firstId);
        }
      } catch (err) {
        console.error('❌ Erreur chargement liste marchés:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleMarkEtapeRealisee = async (etapeId) => {
    try {
      await MarcheService.markEtapeRealisee(etapeId);
      if (selectedMarcheId) {
        loadMarcheDetail(selectedMarcheId);
      }
    } catch (err) {
      console.error('❌ Erreur marquage étape réalisée:', err);
      alert('Erreur lors de la validation de l’étape');
    }
  };

  const loadMarcheDetail = async (marcheNumero) => {
    setLoading(true);
    try {
      const marcheData = await MarcheService.getMarche(marcheNumero);
      const phases = await MarcheService.getPhasesByMarche(marcheNumero);

      const phasesAvecEtapes = await Promise.all(
        phases.map(async (p) => {
          try {
            const etapes = await MarcheService.getEtapesByPhase(p.id);
            return { ...p, etapes };
          } catch (err) {
            console.warn(`Erreur chargement étapes pour phase ${p.id}:`, err);
            return { ...p, etapes: [] };
          }
        })
      );

      setMarche({ ...marcheData, phases: phasesAvecEtapes });
    } catch (err) {
      console.error('❌ Erreur chargement marché:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- États des formulaires ----
  const [newMarcheForm, setNewMarcheForm] = useState({
    numero: '',
    type: '',
    dateNotification: '',
    dateDemarrage: '',
    montantEstime: '',
  });

  const [newPhaseForm, setNewPhaseForm] = useState({
    marcheNumero: '',
    nom: '',
    dateDebut: '',
    dateFinPrevue: '',
    dureeMois: '',
    pourcentageMontant: '',
  });

  const [newEtapeForm, setNewEtapeForm] = useState({
    phaseId: '',
    libelle: '',
    code: '',
    datePrevue: '',
    delaiAvantFinJours: '',
  });

  // ---- Gestion des créations ----
  const handleCreateMarche = async () => {
    try {
      const payload = {
        ...newMarcheForm,
        montantEstime: parseFloat(newMarcheForm.montantEstime) || 0,
      };
      const newMarche = await MarcheService.createMarche(payload);
      setMarches([...marches, newMarche]);
      setNewMarcheForm({ numero: '', type: '', dateNotification: '', dateDemarrage: '', montantEstime: '' });
    } catch (err) {
      alert('Erreur création marché: ' + err.message);
    }
  };

  const handleCreatePhase = async () => {
    if (!newPhaseForm.marcheNumero) return;
    try {
      const payload = {
        nom: newPhaseForm.nom,
        dateDebut: newPhaseForm.dateDebut,
        dateFinPrevue: newPhaseForm.dateFinPrevue,
        dureeMois: parseInt(newPhaseForm.dureeMois) || 0,
        pourcentageMontant: parseFloat(newPhaseForm.pourcentageMontant) || 0,
        marcheNumero: newPhaseForm.marcheNumero,
      };
      await MarcheService.createPhase(newPhaseForm.marcheNumero, payload);
      loadMarcheDetail(newPhaseForm.marcheNumero);
      setNewPhaseForm({
        marcheNumero: newPhaseForm.marcheNumero,
        nom: '',
        dateDebut: '',
        dateFinPrevue: '',
        dureeMois: '',
        pourcentageMontant: '',
      });
    } catch (err) {
      alert('Erreur création phase: ' + err.message);
    }
  };

  const handleCreateEtape = async () => {
    if (!newEtapeForm.phaseId) return;
    try {
      const payload = {
        libelle: newEtapeForm.libelle,
        code: newEtapeForm.code,
        datePrevue: newEtapeForm.datePrevue,
        delaiAvantFinJours: parseInt(newEtapeForm.delaiAvantFinJours) || 0,
        phaseId: parseInt(newEtapeForm.phaseId),
      };
      await MarcheService.createEtape(newEtapeForm.phaseId, payload);

      const phaseId = parseInt(newEtapeForm.phaseId);
      const phase = allPhases.find(p => p.id === phaseId);
      if (phase && phase.marcheNumero) {
        loadMarcheDetail(phase.marcheNumero);
      }

      setShowCreateEtape(false);
      setNewEtapeForm({ phaseId: '', libelle: '', code: '', datePrevue: '', delaiAvantFinJours: '' });
    } catch (err) {
      alert('Erreur création étape: ' + err.message);
    }
  };

  if (loading && !marche) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Chargement…</Typography>
      </Box>
    );
  }

  // Récupérer toutes les phases pour le select "étape"
  const allPhases = marches.flatMap(m => 
    (m.phases || []).map(p => ({ ...p, marcheNumero: m.numero }))
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
      {/* --- COLONNE GAUCHE : GESTION --- */}
      <Paper
        elevation={1}
        sx={{
          width: 360,
          p: 2,
          mr: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Gestion des entités
        </Typography>

        {/* Sélection marché */}
        <Typography variant="subtitle2" gutterBottom>
          Sélectionner un marché
        </Typography>
        <Autocomplete
          options={marches}
          getOptionLabel={(marche) => `#${marche.numero.replace('-', '/')} • ${marche.type}`}
          isOptionEqualToValue={(option, value) => option.numero === value?.numero}
          value={marches.find(m => m.numero === selectedMarcheId) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedMarcheId(newValue.numero);
              loadMarcheDetail(newValue.numero);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Marchés"
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <FiClock style={{ marginRight: 8, color: '#666' }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body2" fontWeight="bold">
                #{option.numero.replace('-', '/')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.type}
              </Typography>
            </Box>
          )}
          noOptionsText="Aucun marché"
          fullWidth
          size="small"
        />

        <Divider sx={{ my: 1 }} />

        {/* --- AJOUTER MARCHÉ --- */}
        <Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiPlus />}
            onClick={() => setShowCreateMarche(true)}
            disabled={showCreateMarche}
            fullWidth
          >
            Ajouter un marché
          </Button>

          {showCreateMarche && (
            <Box mt={1} p={1} border={1} borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Nouveau marché
              </Typography>
              <TextField
                size="small"
                label="Numéro (ex: 2025-12)"
                value={newMarcheForm.numero}
                onChange={(e) => setNewMarcheForm({ ...newMarcheForm, numero: e.target.value })}
                fullWidth
                margin="dense"
              />
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel>Type de marché</InputLabel>
                <Select
                  value={newMarcheForm.type}
                  label="Type de marché"
                  onChange={(e) => setNewMarcheForm({ ...newMarcheForm, type: e.target.value })}
                >
                  <MenuItem value="Fourniture">Fourniture</MenuItem>
                  <MenuItem value="Prestation de service">Service</MenuItem>
                  <MenuItem value="Travaux">Travaux</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Date notification (YYYY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newMarcheForm.dateNotification}
                onChange={(e) => setNewMarcheForm({ ...newMarcheForm, dateNotification: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Date démarrage (YYYY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newMarcheForm.dateDemarrage}
                onChange={(e) => setNewMarcheForm({ ...newMarcheForm, dateDemarrage: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Montant estimé"
                type="number"
                value={newMarcheForm.montantEstime}
                onChange={(e) => setNewMarcheForm({ ...newMarcheForm, montantEstime: e.target.value })}
                fullWidth
                margin="dense"
              />
              <Box mt={1} display="flex" gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCreateMarche}
                  disabled={!newMarcheForm.numero || !newMarcheForm.type}
                >
                  Créer
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowCreateMarche(false);
                    setNewMarcheForm({ numero: '', type: '', dateNotification: '', dateDemarrage: '', montantEstime: '' });
                  }}
                >
                  Annuler
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* --- AJOUTER PHASE --- */}
        <Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiPlus />}
            onClick={() => setShowCreatePhase(true)}
            disabled={showCreatePhase || !selectedMarcheId}
            fullWidth
          >
            Ajouter une phase
          </Button>

          {showCreatePhase && (
            <Box mt={1} p={1} border={1} borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Nouvelle phase
              </Typography>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel>Marché</InputLabel>
                <Select
                  value={newPhaseForm.marcheNumero}
                  label="Marché"
                  onChange={(e) => setNewPhaseForm({ ...newPhaseForm, marcheNumero: e.target.value })}
                >
                  {marches.map((m) => (
                    <MenuItem key={m.numero} value={m.numero}>
                      #{m.numero.replace('-', '/')} - {m.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Nom phase"
                value={newPhaseForm.nom}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, nom: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Date début (YYYY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newPhaseForm.dateDebut}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, dateDebut: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Date fin prévue (YYYY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newPhaseForm.dateFinPrevue}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, dateFinPrevue: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Durée (mois)"
                type="number"
                value={newPhaseForm.dureeMois}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, dureeMois: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="% du montant"
                type="number"
                value={newPhaseForm.pourcentageMontant}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, pourcentageMontant: e.target.value })}
                fullWidth
                margin="dense"
              />
              <Box mt={1} display="flex" gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCreatePhase}
                  disabled={!newPhaseForm.marcheNumero || !newPhaseForm.nom}
                >
                  Créer
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowCreatePhase(false);
                    setNewPhaseForm({
                      marcheNumero: selectedMarcheId || '',
                      nom: '',
                      dateDebut: '',
                      dateFinPrevue: '',
                      dureeMois: '',
                      pourcentageMontant: '',
                    });
                  }}
                >
                  Annuler
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* --- AJOUTER ÉTAPE --- */}
        <Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiPlus />}
            onClick={() => setShowCreateEtape(true)}
            disabled={showCreateEtape || allPhases.length === 0}
            fullWidth
          >
            Ajouter une étape
          </Button>

          {showCreateEtape && (
            <Box mt={1} p={1} border={1} borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Nouvelle étape
              </Typography>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel>Phase</InputLabel>
                <Select
                  value={newEtapeForm.phaseId}
                  label="Phase"
                  onChange={(e) => setNewEtapeForm({ ...newEtapeForm, phaseId: e.target.value })}
                >
                  {allPhases.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nom} (#{p.marcheNumero})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Code"
                value={newEtapeForm.code}
                onChange={(e) => setNewEtapeForm({ ...newEtapeForm, code: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Libellé"
                value={newEtapeForm.libelle}
                onChange={(e) => setNewEtapeForm({ ...newEtapeForm, libelle: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Date prévue (YYYY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newEtapeForm.datePrevue}
                onChange={(e) => setNewEtapeForm({ ...newEtapeForm, datePrevue: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                size="small"
                label="Délai avant fin (jours)"
                type="number"
                value={newEtapeForm.delaiAvantFinJours}
                onChange={(e) => setNewEtapeForm({ ...newEtapeForm, delaiAvantFinJours: e.target.value })}
                fullWidth
                margin="dense"
              />
              <Box mt={1} display="flex" gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCreateEtape}
                  disabled={!newEtapeForm.phaseId || !newEtapeForm.libelle}
                >
                  Créer
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowCreateEtape(false);
                    setNewEtapeForm({ phaseId: '', libelle: '', code: '', datePrevue: '', delaiAvantFinJours: '' });
                  }}
                >
                  Annuler
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* --- COLONNE DROITE : TIMELINE VISUELLE --- */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : marche ? (
          <MarcheTimelineVisual marche={marche} onMarkEtapeRealisee={handleMarkEtapeRealisee} />
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">Sélectionnez un marché à gauche</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};