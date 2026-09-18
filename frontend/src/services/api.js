const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function getToken() {
  const auth = localStorage.getItem("vettri.auth");
  if (!auth) return null;
  try {
    return JSON.parse(auth).access_token;
  } catch {
    return null;
  }
}

function formatError(body, status, statusText) {
  if (!body) return `HTTP ${status} ${statusText}`;

  const detail = body.detail;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = Array.isArray(d.loc)
          ? d.loc.filter((x) => x !== "body").join(".")
          : "";
        const msg = d.msg || "Invalid value";
        return field ? `${field}: ${msg}` : msg;
      })
      .join(" | ");
  }

  if (detail) return String(detail);
  return `HTTP ${status} ${statusText}`;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    throw new Error(formatError(body, res.status, res.statusText));
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  health: () => request("/api/v1/health"),

  register: (data) =>
    request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data) =>
    request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request("/api/v1/auth/me"),

  getProfile: () => request("/api/v1/users/profile"),
  saveProfile: (data) =>
    request("/api/v1/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  listSchemes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/v1/schemes${qs ? `?${qs}` : ""}`);
  },
  getScheme: (slug) => request(`/api/v1/schemes/${slug}`),
  getRecommendations: () =>
    request("/api/v1/schemes/recommendations", { method: "POST" }),

  affordability: (data) =>
    request("/api/v1/affordability", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  documents: {
    getChecklist: (slug) => request(`/api/v1/documents/schemes/${slug}`),
    updateChecklist: (slug, items) =>
      request(`/api/v1/documents/schemes/${slug}`, {
        method: "PUT",
        body: JSON.stringify({ items }),
      }),
  },

  feedback: {
    submit: (scheme_slug, vote, comment = null) =>
      request("/api/v1/feedback/recommendation", {
        method: "POST",
        body: JSON.stringify({ scheme_slug, vote, comment }),
      }),
  },

  admin: {
    listSchemes: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/v1/admin/schemes${qs ? `?${qs}` : ""}`);
    },
    createScheme: (data) =>
      request("/api/v1/admin/schemes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateScheme: (id, data) =>
      request(`/api/v1/admin/schemes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteScheme: (id) =>
      request(`/api/v1/admin/schemes/${id}`, { method: "DELETE" }),
    listUsers: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/v1/admin/users${qs ? `?${qs}` : ""}`);
    },
    analytics: () => request("/api/v1/admin/analytics/overview"),
  },
};

export { API_BASE };