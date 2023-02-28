import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { ColorTabs } from './practice/App'

export const basename="react-ts-vite"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
<BrowserRouter basename={basename}>
<Routes>
  <Route path="/" element={<App/>}/>
  <Route path="/practice" element={<ColorTabs/>}/>
</Routes>
</BrowserRouter>
  </React.StrictMode>,
)
