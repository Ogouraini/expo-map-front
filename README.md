# interactive-exhibition-map

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

# Mocks API — Plan d'exposition (VueJS)

Ce dossier contient un **mock d'API réaliste** (via [MSW](https://mswjs.io/)) pour un
seul événement (`evt-2026-salon-innov`, 2 halls). Le principe : votre code Vue
appelle les **mêmes URL** que le futur vrai backend. Rien de statique — chaque
requête passe par une vraie logique JS (`src/mocks/db.js`), avec latence
réseau simulée, erreurs 404, création/édition/suppression persistées en
mémoire le temps de la session.

## Installation dans votre projet Vue existant

```bash

# 1. installez msw
npm install msw --save-dev

# 2. générez le service worker dans le dossier /public
npx msw init public/ --save
```

## Endpoints mockés (identiques au cahier des charges)

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/events/{event}/exhibition-plans` | Liste des halls/plans de l'événement |
| GET | `/api/exhibition-plans/{plan}/spaces` | Espaces d'un plan (stands + toilettes + presse + salles de conf), enrichis avec l'exposant ou la session associée |
| GET | `/api/events/{event}/exhibition-spaces/search?q=` | Recherche transversale (nom exposant / n° stand / catégorie), retourne `plan_id` pour basculer de hall |
| POST | `/api/exhibition-plans` | Création d'un hall |
| POST | `/api/exhibition-plans/{plan}/spaces` | Création d'un espace |
| PUT | `/api/exhibition-plans/{plan}/spaces/{space}` | Édition (position, association, type, statut...) |
| DELETE | `/api/exhibition-plans/{plan}/spaces/{space}` | Suppression |

Event de test : `evt-2026-salon-innov`
Plans de test : `plan-hall-a`, `plan-hall-b`


## Modèle de données mocké

- **statut** : `'libre' | 'occupé' | 'réservé'`
- **geometrie** : polygone en pixels absolus, `[[x, y], [x, y], ...]`
  (un rectangle est simplement un polygone à 4 points)
- **categorie** : chaîne libre (ex. `"Technologie"`, `"Agroalimentaire"`)
- **type** d'espace : `stand`, `conference_hall`, `restroom`, `press_area`,
  `accueil` (extensible — c'est ce champ qui pilote l'icône et le comportement au clic)
- Chaque espace enrichi contient `exposant` (objet complet, ou `null`) et/ou
  `session_conference` (objet complet, ou `null`) selon son `type` — c'est le
  même schéma que renverra le vrai backend une fois les fiches exposant/conférence
  reliées.

