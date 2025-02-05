/// <reference types="vite/client" />
import 'vite/client'

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_KEY: string;
  readonly VITE_REACT_APP_API_URL: string;
  readonly VITE_REACT_APP_IMG_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

