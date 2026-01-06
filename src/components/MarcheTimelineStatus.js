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
} from '@mui/material';
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Autocomplete } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { MarcheService } from '../components/service';
import { MarcheStatusView } from './MarcheStatusView';
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

const getStatusChip = (isEnRetard, isARisque, jours) => {
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
  if (jours >= 0) {
    const label = jours === 0 ? 'J-0 (auj.)' : `J-${jours}`;
    return (
      <Chip
        icon={<FiClock size={14} />}
        label={label}
        size="small"
        color="success"
        variant="outlined"
      />
    );
  }
  return null;
};

// ----- Composant détail marché -----
const MarcheTimelineDetail = ({ marche , onMarkEtapeRealisee}) => {
  const displayNumero = marche.numero.replace('-', '/');



  
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        p: 3,
        height: 'fit-content',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
        Marché <Box component="span" color="primary.main">#{displayNumero}</Box> • {marche.type}
      </Typography>

      <Box position="relative" pt={1}>
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            top: 0,
            bottom: -24,
            width: '2px',
            backgroundColor: 'divider',
            zIndex: -1,
          }}
        />

        <Box sx={{ pl: 6 }}>
          {marche.phases?.map((phase) => {
            const jours = getJoursRestants(phase.dateFinPrevue);
            const isEnRetard = new Date(phase.dateFinPrevue) < new Date() && !phase.dateFinReelle;
            const isARisque = !isEnRetard && jours >= 0 && jours <= 7;

            return (
              <Box key={phase.id} position="relative" mb={4}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -24,
                    top: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isEnRetard
                      ? 'error.main'
                      : isARisque
                      ? 'warning.main'
                      : 'success.main',
                    color: 'white',
                    border: '2px solid white',
                  }}
                >
                  {isEnRetard && <FiXCircle size={12} />}
                  {isARisque && <FiAlertTriangle size={12} />}
                </Box>

                <Card
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid`,
                    borderColor: isEnRetard
                      ? 'error.main'
                      : isARisque
                      ? 'warning.main'
                      : 'success.main',
                    bgcolor: isEnRetard
                      ? 'error.lighter'
                      : isARisque
                      ? 'warning.lighter'
                      : 'success.lighter',
                    p: 2,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {phase.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(phase.dateDebut)} → {formatDate(phase.dateFinPrevue)}
                      </Typography>
                    </Box>
                    {getStatusChip(isEnRetard, isARisque, jours)}
                  </Box>

                  {phase.etapes && phase.etapes.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="caption" fontWeight="medium" color="text.secondary" gutterBottom>
                        Étapes clés :
                      </Typography>
                      <List dense sx={{ pt: 0 }}>
                        {phase.etapes.map((etape) => (
<ListItem
  key={etape.id}
  disableGutters
  sx={{
    py: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  }}
>
  {/* Icône statut */}
  <ListItemIcon sx={{ minWidth: 28 }}>
    {etape.realisee ? (
      <CheckCircleIcon color="success" fontSize="small" />
    ) : (
      <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
    )}
  </ListItemIcon>

  {/* Libellé */}
  <ListItemText
    primary={
      <Typography
        variant="body2"
        sx={{
          textDecoration: etape.realisee ? 'line-through' : 'none',
          color: etape.realisee ? 'text.disabled' : 'text.primary',
        }}
      >
        {etape.libelle}
      </Typography>
    }
  />

  {/* Bouton Réalisée */}
  {!etape.realisee && (
    <Tooltip title="Marquer comme réalisée">
      <IconButton
        size="small"
        color="success"
       onClick={() => onMarkEtapeRealisee(etape.id)}

      >
        <CheckCircleIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )}
</ListItem>

                        ))}
                      </List>
                    </Box>
                  )}
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

// ----- Composant principal -----
export const MarcheTimelineStatus = () => {
  const [marches, setMarches] = useState([]);
  const [selectedMarcheId, setSelectedMarcheId] = useState(null);
  const [marche, setMarche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateMarche, setShowCreateMarche] = useState(false);
const [showCreatePhase, setShowCreatePhase] = useState(false);
const [showCreateEtape, setShowCreateEtape] = useState(false);






// Dans le useEffect ou après le chargement :
useEffect(() => {
  if (selectedMarcheId && !showCreatePhase) {
    setNewPhaseForm(prev => ({ ...prev, marcheNumero: selectedMarcheId }));
  }
}, [selectedMarcheId]);

  // --- Chargement initial ---
  useEffect(() => {
    const init = async () => {
      try {
        const allMarches = await MarcheService.getAllMarches();
        setMarches(allMarches);
        if (allMarches.length > 0) {
          const firstId = allMarches[0].numero; // 👈 utilise toujours .numero
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

    // 🔄 Recharger le marché courant
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
      const phases = await MarcheService.getPhasesByMarche(marcheNumero); // ⚠️ tu devras ajouter cette méthode

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
    marcheNumero: '', // <-- sélection via Select
    nom: '',
    dateDebut: '',
    dateFinPrevue: '',
    dureeMois: '',
    pourcentageMontant: '',
  });

  const [newEtapeForm, setNewEtapeForm] = useState({
    phaseId: '', // <-- sélection via Select
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
      await MarcheService.createPhase(newPhaseForm.marcheNumero, payload); // le premier paramètre est redondant mais conforme à notre service
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

    // ✅ Utilise marcheNumero (déjà présent dans allPhases)
    const phaseId = parseInt(newEtapeForm.phaseId);
    const phase = allPhases.find(p => p.id === phaseId);
    if (phase && phase.marcheNumero) {
      loadMarcheDetail(phase.marcheNumero); // ✅ Correct
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

      {/* --- COLONNE DROITE : DÉTAIL --- */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : marche ? (
        //   <MarcheTimelineDetail marche={marche} 
          
        //    onMarkEtapeRealisee={handleMarkEtapeRealisee}
          
        //   />

        <MarcheStatusView
  marche={marche}
  error={error}
/>

        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">Sélectionnez un marché à gauche</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};