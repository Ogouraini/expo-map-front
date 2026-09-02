// src/mocks/db.js
// Données en mémoire pour UN SEUL événement.

const EVENT_ID = 'evt-2026-salon-innov';

const event = {
  id: EVENT_ID,
  nom: 'Salon Innov 2026',
  date_debut: '2026-11-10',
  date_fin: '2026-11-12',
};

const exhibitors = [
  {
    id: 'exh-001',
    nom: 'TechNova Solutions',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Éditeur de solutions logicielles pour l\'industrie 4.0.',
    categorie: 'Technologie',
    site_web: 'https://technova-solutions.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/technova-solutions',
  },
  {
    id: 'exh-002',
    nom: 'Bio Saveurs',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Producteur de produits alimentaires bio et locaux.',
    categorie: 'Agroalimentaire',
    site_web: 'https://biosaveurs.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/bio-saveurs',
  },
  {
    id: 'exh-003',
    nom: 'ArtiCraft Maroc',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Coopérative d\'artisanat traditionnel marocain.',
    categorie: 'Artisanat',
    site_web: 'https://articraft.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/articraft-maroc',
  },
  {
    id: 'exh-004',
    nom: 'MedInnov',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Dispositifs médicaux connectés et télémédecine.',
    categorie: 'Santé',
    site_web: 'https://medinnov.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/medinnov',
  },
  {
    id: 'exh-005',
    nom: 'GreenBuild',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Matériaux et solutions pour la construction durable.',
    categorie: 'Construction durable',
    site_web: 'https://greenbuild.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/greenbuild',
  },
  {
    id: 'exh-006',
    nom: 'DataFlow Analytics',
    logo_url: 'https://play-lh.googleusercontent.com/YMzTWiWeE2pt_sxc0-cvxkfXB8QoLYlaQEWj7IdWAySoSyKMr6vF1PjkeonNBAxTBUsPPhHP0IOY256g8gpjwg',
    description: 'Plateforme d\'analyse de données en temps réel.',
    categorie: 'Technologie',
    site_web: 'https://dataflow-analytics.example.com',
    lien_fiche_complete: 'https://webevents.example.com/exposants/dataflow-analytics',
  },
];

const conferenceSessions = [
  {
    id: 'conf-001',
    titre: "Les tendances de l'IA en 2026",
    horaire_debut: '2026-11-10T10:00:00',
    horaire_fin: '2026-11-10T11:00:00',
    intervenants: ['Nadia El Amrani', 'Karim Bensouda'],
    lien_fiche_session: 'https://webevents.example.com/conferences/tendances-ia-2026',
  },
  {
    id: 'conf-002',
    titre: 'Transition énergétique : enjeux et opportunités',
    horaire_debut: '2026-11-11T14:00:00',
    horaire_fin: '2026-11-11T15:30:00',
    intervenants: ['Youssef Idrissi'],
    lien_fiche_session: 'https://webevents.example.com/conferences/transition-energetique',
  },
];

const plans = [
  {
    id: 'plan-hall-a',
    event_id: EVENT_ID,
    nom: 'Hall A',
    ordre: 1,
    background_svg_url: '/assets/plans/hall-a.svg',
    largeur_reference: 1200,
    hauteur_reference: 800,
  },
  {
    id: 'plan-hall-b',
    event_id: EVENT_ID,
    nom: 'Hall B',
    ordre: 2,
    background_svg_url: '/assets/plans/hall-b.svg',
    largeur_reference: 1000,
    hauteur_reference: 700,
  },
];

let spaces = [
  // =========================================================================
  // HALL A (Dimensions ref: 1200x800)
  // =========================================================================

  // Entrées (Forme pétale sur la droite)
  {
    id: 'space-a-entrance-1',
    plan_id: 'plan-hall-a',
    type: 'entrance',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Entrée 1',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [ [1180, 190], [1139, 176], [1106, 162], [1083, 148], [1070, 134], [1065, 120], [1070, 106], [1083, 92], [1106, 78], [1139, 64], [1180, 50] ],  
  },
  {
    id: 'space-a-entrance-2',
    plan_id: 'plan-hall-a',
    type: 'entrance',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Entrée 2',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[1180, 770], [1139, 712], [1106, 704], [1083, 696], [1070, 688], [1065, 680], [1070, 672], [1083, 664], [1106, 656], [1139, 648], [1180, 640]],
  },

  // Accueil (Positionné sous l'Entrée 1 le long du mur droit, selon le 'A' de la photo)
  {
    id: 'space-a-accueil',
    plan_id: 'plan-hall-a',
    type: 'accueil',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Accueil',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[1050, 200], [1180, 200], [1180, 320], [1050, 320]],
  },

  // Toilettes (WC)
  {
    id: 'space-a-wc-1',
    plan_id: 'plan-hall-a',
    type: 'restroom',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'WC',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[50, 50], [150, 50], [150, 110], [50, 110]],
  },
  {
    id: 'space-a-wc-2',
    plan_id: 'plan-hall-a',
    type: 'restroom',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'WC',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[50, 690], [150, 690], [150, 750], [50, 750]],
  },

  // Conférence & Presse
  {
    id: 'space-a-conf-1',
    plan_id: 'plan-hall-a',
    type: 'conference_hall',
    exhibitor_id: null,
    conference_session_id: 'conf-001',
    libelle: 'Salle de conférence 1',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [ [50, 450],  [300, 450], [350, 500],  [350, 650],  [50, 650]],  
},
  {
    id: 'space-a-press',
    plan_id: 'plan-hall-a',
    type: 'press_area',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Espace Presse',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[850, 640], [1000, 640], [1000, 720], [850, 720]],
  },

  // Stands en grille centrale (A01 à A12)
  {
    id: 'space-a1',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: 'exh-001',
    conference_session_id: null,
    libelle: 'TechNova Solutions',
    numero_stand: 'A01',
    categorie: 'Technologie',
    statut: 'occupé',
    geometrie: [[277, 170], [310, 150], [320, 230], [200, 230]],
  },
  {
    id: 'space-a2',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: 'exh-002',
    conference_session_id: null,
    libelle: 'Bio Saveurs',
    numero_stand: 'A02',
    categorie: 'Agroalimentaire',
    statut: 'occupé',
    geometrie: [[340, 150], [460, 150], [460, 230], [340, 230]],
  },
  {
    id: 'space-a3',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: 'exh-004',
    conference_session_id: null,
    libelle: 'MedInnov',
    numero_stand: 'A03',
    categorie: 'Santé',
    statut: 'réservé',
    geometrie: [[480, 150], [600, 150], [600, 230], [480, 230]],
  },
  {
    id: 'space-a4',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A04',
    categorie: null,
    statut: 'libre',
    geometrie: [[620, 150], [740, 150], [740, 230], [620, 230]],
  },
  {
    id: 'space-a5',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A05',
    categorie: null,
    statut: 'libre',
    geometrie: [[760, 150], [880, 150], [880, 230], [760, 230]],
  },
  {
    id: 'space-a6',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A06',
    categorie: null,
    statut: 'libre',
    geometrie: [[200, 280], [320, 280], [320, 360], [200, 360]],
  },
  {
    id: 'space-a7',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A07',
    categorie: null,
    statut: 'libre',
    geometrie: [[340, 280], [460, 280], [460, 360], [340, 360]],
  },
  {
    id: 'space-a8',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A08',
    categorie: null,
    statut: 'libre',
    geometrie: [[480, 280], [600, 280], [600, 360], [480, 360]],
  },
  {
    id: 'space-a9',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A09',
    categorie: null,
    statut: 'libre',
    geometrie: [[620, 280], [740, 280], [740, 360], [620, 360]],
  },
  {
    id: 'space-a10',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A10',
    categorie: null,
    statut: 'libre',
    geometrie: [[480, 450], [600, 450], [600, 530], [480, 530]],
  },
  {
    id: 'space-a11',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A11',
    categorie: null,
    statut: 'libre',
    geometrie: [[620, 450], [740, 450], [740, 530], [620, 530]],
  },
  {
    id: 'space-a12',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A12',
    categorie: null,
    statut: 'libre',
    geometrie: [[760, 450], [880, 450], [880, 530], [760, 530]],
  },

  // Stands sur le bord droit (Positionnés selon les 'S' de la photo)
  {
    id: 'space-a13',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A13',
    categorie: null,
    statut: 'libre',
    geometrie: [[1050, 340], [1180, 340], [1180, 460], [1050, 460]],
  },
  {
    id: 'space-a14',
    plan_id: 'plan-hall-a',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'A14',
    categorie: null,
    statut: 'libre',
    geometrie: [[1050, 480], [1180, 480], [1180, 600], [1050, 600]],
  },

  // =========================================================================
  // HALL B (Dimensions ref: 1000x700)
  // =========================================================================

  {
    id: 'space-b-entrance-1',
    plan_id: 'plan-hall-b',
    type: 'entrance',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Entrée 1',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[970, 130], [939, 123], [916, 116], [899, 109], [888, 102], [885, 95], [888, 88], [899, 81], [916, 74], [939, 67], [970, 60]],
  },
  {
    id: 'space-b-entrance-2',
    plan_id: 'plan-hall-b',
    type: 'entrance',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Entrée 2',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[970, 620], [939, 613], [916, 606], [899, 599], [888, 592], [885, 585], [888, 578], [899, 571], [916, 564], [939, 557], [970, 550]],
  },
  {
    id: 'space-b-accueil',
    plan_id: 'plan-hall-b',
    type: 'accueil',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Accueil',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[680, 60], [810, 60], [810, 130], [680, 130]],
  },

  {
    id: 'space-b-wc-1',
    plan_id: 'plan-hall-b',
    type: 'restroom',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'WC',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[40, 40], [130, 40], [130, 90], [40, 90]],
  },
  {
    id: 'space-b-wc-2',
    plan_id: 'plan-hall-b',
    type: 'restroom',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'WC',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[40, 600], [130, 600], [130, 650], [40, 650]],
  },

  {
    id: 'space-b-conf-2',
    plan_id: 'plan-hall-b',
    type: 'conference_hall',
    exhibitor_id: null,
    conference_session_id: 'conf-002',
    libelle: 'Salle de conférence 2',
    numero_stand: null,
    categorie: null,
    statut: null,
    geometrie: [[40, 380], [320, 380], [320, 550], [40, 550]],
  },

  {
    id: 'space-b1',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: 'exh-003',
    conference_session_id: null,
    libelle: 'ArtiCraft Maroc',
    numero_stand: 'B01',
    categorie: 'Artisanat',
    statut: 'occupé',
    geometrie: [[160, 130], [270, 130], [270, 210], [160, 210]],
  },
  {
    id: 'space-b2',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: 'exh-005',
    conference_session_id: null,
    libelle: 'GreenBuild',
    numero_stand: 'B02',
    categorie: 'Construction durable',
    statut: 'occupé',
    geometrie: [[290, 130], [400, 130], [400, 210], [290, 210]],
  },
  {
    id: 'space-b3',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: 'exh-006',
    conference_session_id: null,
    libelle: 'DataFlow Analytics',
    numero_stand: 'B03',
    categorie: 'Technologie',
    statut: 'réservé',
    geometrie: [[420, 130], [530, 130], [530, 210], [420, 210]],
  },
  {
    id: 'space-b4',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B04',
    categorie: null,
    statut: 'libre',
    geometrie: [[550, 130], [660, 130], [660, 210], [550, 210]],
  },
  {
    id: 'space-b5',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B05',
    categorie: null,
    statut: 'libre',
    geometrie: [[160, 250], [270, 250], [270, 330], [160, 330]],
  },
  {
    id: 'space-b6',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B06',
    categorie: null,
    statut: 'libre',
    geometrie: [[290, 250], [400, 250], [400, 330], [290, 330]],
  },
  {
    id: 'space-b7',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B07',
    categorie: null,
    statut: 'libre',
    geometrie: [[420, 250], [530, 250], [530, 330], [420, 330]],
  },
  {
    id: 'space-b8',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B08',
    categorie: null,
    statut: 'libre',
    geometrie: [[550, 250], [660, 250], [660, 330], [550, 330]],
  },
  {
    id: 'space-b9',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B09',
    categorie: null,
    statut: 'libre',
    geometrie: [[420, 380], [530, 380], [530, 460], [420, 460]],
  },
  {
    id: 'space-b10',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B10',
    categorie: null,
    statut: 'libre',
    geometrie: [[550, 380], [660, 380], [660, 460], [550, 460]],
  },
  {
    id: 'space-b11',
    plan_id: 'plan-hall-b',
    type: 'stand',
    exhibitor_id: null,
    conference_session_id: null,
    libelle: 'Stand disponible',
    numero_stand: 'B11',
    categorie: null,
    statut: 'libre',
    geometrie: [[680, 380], [790, 380], [790, 460], [680, 460]],
  },
];

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------
let spaceAutoId = spaces.length + 1;
let planAutoId = plans.length + 1;

function findExhibitor(id) {
  return exhibitors.find((e) => e.id === id) || null;
}

function findConferenceSession(id) {
  return conferenceSessions.find((c) => c.id === id) || null;
}

// Enrichit un espace avec l'objet exposant ou l'objet session de conférence
// associé, selon son "type" — c'est le champ type qui pilote quoi attacher.
function enrichSpace(space) {
  return {
    ...space,
    exposant: space.exhibitor_id ? findExhibitor(space.exhibitor_id) : null,
    session_conference: space.conference_session_id
      ? findConferenceSession(space.conference_session_id)
      : null,
  };
}

// ---------------------------------------------------------------------------
// API interne appelée par les handlers MSW
// ---------------------------------------------------------------------------
export const db = {
  // GET /api/events/{event}/exhibition-plans
  getPlans(eventId) {
    if (String(eventId) !== String(EVENT_ID)) return null;
    return plans.filter((p) => p.event_id === eventId).sort((a, b) => a.ordre - b.ordre);
  },

  // GET /api/exhibition-plans/{plan}/spaces
  getSpacesByPlan(planId) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return null;
    return spaces.filter((s) => s.plan_id === planId).map(enrichSpace);
  },

  // GET /api/events/{event}/exhibition-spaces/search?q=
  searchSpaces(eventId, q) {
    if (eventId !== EVENT_ID) return null;
    const planIdsForEvent = plans.filter((p) => p.event_id === eventId).map((p) => p.id);
    const query = (q || '').trim().toLowerCase();
    if (!query) return [];

    return spaces
      .filter((s) => planIdsForEvent.includes(s.plan_id))
      .filter((s) => {
        const exposant = s.exhibitor_id ? findExhibitor(s.exhibitor_id) : null;
        const haystack = [
          s.libelle,
          s.numero_stand,
          s.categorie,
          exposant ? exposant.nom : null,
          exposant ? exposant.categorie : null,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
      .map((s) => ({
        ...enrichSpace(s),
        // le plan_id est déjà présent sur l'espace, mais on l'expose bien en
        // évidence car c'est lui qui permet au front de basculer de hall
        plan_id: s.plan_id,
      }));
  },

  // POST /api/exhibition-plans
  createPlan(payload) {
    const newPlan = {
      id: `plan-${planAutoId++}`,
      event_id: EVENT_ID,
      nom: payload.nom || 'Nouveau hall',
      ordre: payload.ordre ?? plans.length + 1,
      // dans le vrai backend : résultat de la conversion PDF -> SVG
      background_svg_url: payload.background_svg_url || `/assets/plans/plan-${planAutoId}.svg`,
      largeur_reference: payload.largeur_reference || 1000,
      hauteur_reference: payload.hauteur_reference || 700,
    };
    plans.push(newPlan);
    return newPlan;
  },

  // POST /api/exhibition-plans/{plan}/spaces
  createSpace(planId, payload) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return null;
    const newSpace = {
      id: `space-${spaceAutoId++}`,
      plan_id: planId,
      type: payload.type,
      exhibitor_id: payload.exhibitor_id ?? null,
      conference_session_id: payload.conference_session_id ?? null,
      libelle: payload.libelle ?? '',
      numero_stand: payload.numero_stand ?? null,
      categorie: payload.categorie ?? null,
      statut: payload.statut ?? 'libre',
      geometrie: payload.geometrie ?? [],
    };
    spaces.push(newSpace);
    return enrichSpace(newSpace);
  },

  // PUT /api/exhibition-plans/{plan}/spaces/{space}
  updateSpace(planId, spaceId, payload) {
    const index = spaces.findIndex((s) => s.id === spaceId && s.plan_id === planId);
    if (index === -1) return null;
    spaces[index] = { ...spaces[index], ...payload, id: spaceId, plan_id: planId };
    return enrichSpace(spaces[index]);
  },

  // DELETE /api/exhibition-plans/{plan}/spaces/{space}
  deleteSpace(planId, spaceId) {
    const index = spaces.findIndex((s) => s.id === spaceId && s.plan_id === planId);
    if (index === -1) return false;
    spaces.splice(index, 1);
    return true;
  },

  // Utilitaire pour un éventuel écran d'admin / debug
  _raw: { event, exhibitors, conferenceSessions, plans, get spaces() { return spaces; } },
};
