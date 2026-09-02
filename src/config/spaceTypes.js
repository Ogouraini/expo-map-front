// src/config/spaceTypes.js
// C'est ce fichier qui traduit le champ `type` d'un exhibition_space en
// icône/couleur affichée sur le plan 

export const SPACE_TYPE_CONFIG = {
  stand: {
    label: 'Stand',
    icon: '🏬',
    color:'#186416',
  },
  conference_hall: {
    label: 'Salle de conférence',
    icon: '🎤',
    color: '#747a83',
  },
  restroom: {
    label: 'WC',
    icon: '🚻',
    color: '#747a83',
  },
  press_area: {
    label: 'Espace presse',
    icon: '📰',
    color: '#747a83',
  },
  accueil: {
    label: 'Accueil',
    icon: 'ℹ️',
    color: '#747a83',
  },
  entrance: {
    label: 'Entrée',
    icon: '🚪',
    color: '#d2d4d6',
  },
  default: {
    label: "Point d'intérêt",
    icon: '📍',
    color: '#747a83',
  },
};

// Types qui ouvrent une fiche exposant complète au clic
export const EXHIBITOR_TYPES = ['stand'];
// Types qui ouvrent un petit panneau lié à une session de conférence
export const CONFERENCE_TYPES = ['conference_hall'];
// Tous les autres types (restroom, press_area, accueil, futurs types...)
// n'affichent qu'un libellé au clic.

export function getSpaceVisual(space) {
  const config = SPACE_TYPE_CONFIG[space.type] || SPACE_TYPE_CONFIG.default;
  return { color: config.color, icon: config.icon, label: config.label };
}

export function getSpaceInteractionKind(type) {
  if (EXHIBITOR_TYPES.includes(type)) return 'exhibitor';
  if (CONFERENCE_TYPES.includes(type)) return 'conference';
  return 'label';
}
