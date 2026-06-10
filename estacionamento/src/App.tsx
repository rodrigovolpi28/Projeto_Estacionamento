import { useState } from 'react'
import { useParkingStore } from './store/useParkingStore'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import History from './components/History'

type Page = 'dashboard' | 'history'

function App() {
  const user = useParkingStore(state => state.user)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  // If not authenticated, always show Login
  if (!user) {
    return <Login />
  }

  // Handle simple routing
  if (currentPage === 'history') {
    return <History onNavigate={setCurrentPage} />
  }

  return <Dashboard onNavigate={setCurrentPage} />
}

export default App
