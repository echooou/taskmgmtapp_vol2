import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import PowerProvider from './PowerProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <PowerProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </PowerProvider>
    </ErrorBoundary>
  </StrictMode>,
)
