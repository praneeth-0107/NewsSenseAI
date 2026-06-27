/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_NEWSAPI_KEY: string;
    readonly VITE_GROQ_API_KEY?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
