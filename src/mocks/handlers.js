// src/mocks/handlers.js

import { http, HttpResponse, delay } from 'msw';
import { db } from './db';


const NETWORK_DELAY = 300;

export const handlers = [
  // GET /api/events/{event}/exhibition-plans
  http.get('/api/events/:eventId/exhibition-plans', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const plans = db.getPlans(params.eventId);
    if (!plans) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }
    return HttpResponse.json(plans);
  }),

  // GET /api/exhibition-plans/{plan}/spaces
  http.get('/api/exhibition-plans/:planId/spaces', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const spaces = db.getSpacesByPlan(params.planId);
    if (!spaces) {
      return HttpResponse.json({ message: 'Plan introuvable' }, { status: 404 });
    }
    return HttpResponse.json(spaces);
  }),

  // GET /api/events/{event}/exhibition-spaces/search?q=
  http.get('/api/events/:eventId/exhibition-spaces/search', async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const results = db.searchSpaces(params.eventId, q);
    if (results === null) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }
    return HttpResponse.json(results);
  }),

  // POST /api/exhibition-plans (création d'un hall/plan — upload + conversion PDF->SVG)
  http.post('/api/exhibition-plans', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    const plan = db.createPlan(body);
    return HttpResponse.json(plan, { status: 201 });
  }),

  // POST /api/exhibition-plans/{plan}/spaces (création d'un espace)
  http.post('/api/exhibition-plans/:planId/spaces', async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const body = await request.json();
    const space = db.createSpace(params.planId, body);
    if (!space) {
      return HttpResponse.json({ message: 'Plan introuvable' }, { status: 404 });
    }
    return HttpResponse.json(space, { status: 201 });
  }),

  // PUT /api/exhibition-plans/{plan}/spaces/{space} (édition position/association/type)
  http.put('/api/exhibition-plans/:planId/spaces/:spaceId', async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const body = await request.json();
    const space = db.updateSpace(params.planId, params.spaceId, body);
    if (!space) {
      return HttpResponse.json({ message: 'Espace introuvable' }, { status: 404 });
    }
    return HttpResponse.json(space);
  }),

  // DELETE /api/exhibition-plans/{plan}/spaces/{space}
  http.delete('/api/exhibition-plans/:planId/spaces/:spaceId', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const ok = db.deleteSpace(params.planId, params.spaceId);
    if (!ok) {
      return HttpResponse.json({ message: 'Espace introuvable' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
