import React from 'react'
import { Link } from 'react-router-dom'
import {ExternalLink, Calendar, Tag} from "lucide-react"
import useSolutionsStore from '../store/solutionsStore'

function SolutionsList() {
  const solutions = useSolutionsStore((state) => state.solutions)
  
  return (
    <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold mb-1'>Solutions</h1>
            <p>Browse and Manage Problem-Solution documentation</p>
          </div>
          <div className='px-4 py-2 text-white bg-slate-500 hover:bg-slate-400 cursor-pointer text-center rounded-lg '>
            <Link to="add-new">
              + Add New Solution
            </Link>
          </div>
        </div>
        <div>
          {solutions.length === 0 ? (
            <p>No solutions available. Click "Add New Solution" to create one.</p>
          ):
          (
            solutions.map((solution, index) => (
              <div key = {index} className='border border-gray-300 px-4 py-6 rounded-lg mb-4 '>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-semibold'>{solution.title}</h2>
                  <div className = "flex gap-2 items-center">
                    <div className='py-1 px-3  bg-slate-300 rounded-lg text-sm'> {solution.status} </div>
                    <Link to={`/solution/${solution.id}`}>
                      <span className='p-2 border border-gray-400 rounded-lg flex items-center justify-center hover:bg-slate-200 cursor-pointer'>
                      <ExternalLink className='size-4'/>
                    </span>
                    </Link>
                  </div>
                </div>
                <div>
                  <p className='mt-2 text-gray-600 text-lg'>{solution.description}</p>
                </div>
                <div className='mt-4'>
                  {solution.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className='inline-block text-xs px-2 py-1 rounded-lg mr-2 mb-2 border border-gray-400 text-gray-700'>
                      <Tag className='size-3 inline-block mr-1'/>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className ="mt-2">
                  <div className='text-sm text-gray-500 flex gap-2 items-center'><Calendar className='size-4'/> <p>Created : {solution.date}</p></div>
                </div>
              </div>
            )) 
          )
          }
        </div>
    </div>
  )
}

export default SolutionsList