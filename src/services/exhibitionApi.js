// src/services/exhibitionApi.js

const BASE_URL = ''; 

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Erreur API (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const exhibitionApi = {
  // GET /api/events/{event}/exhibition-plans
  getPlans(eventId) {
    return request(`/api/events/${eventId}/exhibition-plans`);
  },

  // GET /api/exhibition-plans/{plan}/spaces
  getSpaces(planId) {
    return request(`/api/exhibition-plans/${planId}/spaces`);
  },

  // GET /api/events/{event}/exhibition-spaces/search?q=
  search(eventId, query) {
    const params = new URLSearchParams({ q: query });
    return request(`/api/events/${eventId}/exhibition-spaces/search?${params}`);
  },

  // POST /api/exhibition-plans
  createPlan(payload) {
    return request('/api/exhibition-plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // POST /api/exhibition-plans/{plan}/spaces
  createSpace(planId, payload) {
    return request(`/api/exhibition-plans/${planId}/spaces`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // PUT /api/exhibition-plans/{plan}/spaces/{space}
  updateSpace(planId, spaceId, payload) {
    return request(`/api/exhibition-plans/${planId}/spaces/${spaceId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // DELETE /api/exhibition-plans/{plan}/spaces/{space}
  deleteSpace(planId, spaceId) {
    return request(`/api/exhibition-plans/${planId}/spaces/${spaceId}`, {
      method: 'DELETE',
    });
  },
};
