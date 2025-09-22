import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import SolutionsList from '../pages/Solution'
import Tags from '../pages/Tags'
import Favorites from '../pages/Favorites'
import Profile from '../pages/Profile'
import AddNewSolution from '../pages/add-new-solution'
import SolutionDetails from '../pages/SolutionDetails'
import EditSolution from '../pages/editSolution'

function MainContent() {
  return (
   <Routes>
         <Route path="/" element={<Dashboard />} />
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