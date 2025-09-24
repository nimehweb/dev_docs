import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserPage from './pages/UserPage'
import ProtectedRoute from './components/ProtectedRoute' // You need to create this
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
         <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<UserPage />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
 