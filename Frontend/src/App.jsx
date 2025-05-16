import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import UserProvider from './context/user.context'
import ErrorBoundary from './ErrorBoundary/ErrorBoundary'
import Navbar from './components/headerFooter/NavBar'
import Footer from './components/headerFooter/Footer'
import { useLocation } from 'react-router-dom'
function App() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/register','/project'].includes(location.pathname);

  return (
    <>
      <UserProvider>
        <ErrorBoundary>
        {!hideHeaderFooter && <Navbar />}
          <AppRoutes />
          {!hideHeaderFooter && <Footer />}
        </ErrorBoundary>
      </UserProvider>
    </>
  )
}

export default App
