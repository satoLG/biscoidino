/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL da biscoidino_api, ex. https://biscoidino-api-idj8.onrender.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
