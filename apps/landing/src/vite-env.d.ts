/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GHOST_URL?: string;
  readonly VITE_GHOST_CONTENT_API_KEY?: string;
  readonly VITE_GHOST_TAG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
