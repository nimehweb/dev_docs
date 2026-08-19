import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../legacy/Dashboard'
import SolutionsList from '../legacy/SolutionsList'
import Tags from '../legacy/Tags'
import Favorites from '../legacy/Favorites'
import Profile from '../legacy/Profile'
import AddNewSolution from '../legacy/add-new-solution'
import SolutionDetails from '../legacy/SolutionDetails'
import EditSolution from '../legacy/editSolution'

function MainContent() {
  return (
   <Routes>
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/solution" element={<SolutionsList />}/>
         <Route path="/solution/add-new" element={<AddNewSolution />} />
         <Route path= "/solution/:id" element={<SolutionDetails />} />
         <Route path="/solution/:id/edit" element={<EditSolution />} />
         <Route path="/tags" element={<Tags />} />
         <Route path="/favorites" element={<Favorites />} />
         <Route path="/profile" element={<Profile />} />
  </Routes>
  )
}

export default MainContent