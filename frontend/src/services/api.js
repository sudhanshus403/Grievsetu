// ─── Shared API configuration for all pages ────────────────────
// Import this instead of raw axios + hardcoded URL

import { api } from './authService';

// Re-export the configured axios instance
export default api;
