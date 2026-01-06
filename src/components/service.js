// src/services/api.js

const API_BASE = 'http://192.168.1.80:8081/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Erreur inconnue');
    throw new Error(`Erreur ${response.status}: ${errorText}`);
  }
  return response.json();
};

export const MarcheService = {
  // --- Méthodes existantes (inchangées) ---
  getMarche(numeroUrlSafe) {
    return fetch(`${API_BASE}/marches/${numeroUrlSafe}`).then(handleResponse);
  },

  getEtapesByPhase(phaseId) {
    return fetch(`${API_BASE}/etapes/phase/${phaseId}`).then(handleResponse);
  },

  markEtapeRealisee(etapeId) {
    return fetch(`${API_BASE}/etapes/${etapeId}/realise`, { method: 'PUT' }).then(handleResponse);
  },

  getAllMarches() {
    return fetch(`${API_BASE}/marches`).then(handleResponse);
  },

  createMarche(marcheData) {
    return fetch(`${API_BASE}/marches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marcheData),
    }).then(handleResponse);
  },

  // --- CORRIGÉ : utilise /api/phases (pas /marches/.../phases) ---
  createPhase(marcheNumero, phaseData) {
    // Ton backend attend un objet avec marcheNumero (string), pas marcheId
    const payload = {
      ...phaseData,
      marcheNumero: marcheNumero, // ⚠️ clé essentielle pour ton backend
    };
    return fetch(`${API_BASE}/phases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },


getPhasesByMarche(marcheNumero) {
  return fetch(`${API_BASE}/phases/marche/${marcheNumero}`).then(handleResponse);
},




  // --- CORRIGÉ : utilise /api/etapes (pas /phases/.../etapes) ---
  createEtape(phaseId, etapeData) {
    const payload = {
      ...etapeData,
      phaseId: phaseId, // ton backend attend phaseId (numérique)
    };
    return fetch(`${API_BASE}/etapes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  }
};