import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import '@fontsource/inter';
import './main.css'

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
