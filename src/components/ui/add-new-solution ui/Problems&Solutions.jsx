import {useState, useRef, useEffect} from "react"
import { useFormContext} from "react-hook-form"
import { EyeIcon, File } from 'lucide-react'
import MarkdownRenderer from "../MarkdownRenderer"

function ProblemsAndSolutions() {
    const {register, watch} = useFormContext()
    const [mode, setMode] = useState('edit')

    const problemText = watch('problemDescription') || ''
    const solutionText = watch('solutionSteps') || ''
   
  return (
    <section className="Problems&Solutions my-6 p-6 border border-gray-300 dark:border-gray-700 rounded-lg ">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Problem & Solution</h2>
                      <p> Detailed description of problem and how to solve it</p>  
                    </div>
                    <div className="flex gap-4">
                        <div 
                        onClick={() => setMode('edit')}
                        className=" p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer ">
                            <File className="inline-block mr-2"/>
                            Edit
                        </div>
                        <div 
                        onClick={() => setMode('preview')}
                        className = " p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500  cursor-pointer">
                            <EyeIcon className="inline-block mr-2"/>
                            Preview
                        </div>
                    </div>
                </div>
                    {mode === 'edit' ?(
                    <div>
                         <label htmlFor="" className="block mb-2 font-medium"> Problem Description</label>
                        <textarea 
                        {...register("problemDescription")} 
                        onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg overflow-hidden" id="description" 
                        name="problemDescription" rows={4} 
                        placeholder="Describe the problem in detail"></textarea>
                    </div>
                        ):(
                            <div>
                                <label htmlFor="" className="block mb-2 font-medium"> Problem Preview</label>
                                <MarkdownRenderer content={problemText} />
                            </div>
                           
                        )
                    }
                    
                    {mode === 'edit' ?(
                    <div>
                        <label htmlFor="" className="block mb-2 font-medium"> Solution Steps</label>
                        <textarea {...register("solutionSteps")} 
                        onInput={(e) => { 
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                     }}
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg overflow-hidden" 
                        id="solutionSteps" name="solution_steps"
                         rows={4} placeholder="Provide step-by-step solution"></textarea>
                    </div>
                    ):(
                        <div>
                            <label htmlFor="" className="block mb-2 font-medium"> Solution Preview</label>
                             <MarkdownRenderer content={solutionText} />
                        </div>
                       
                    )}
                    
    </section>
  )
}

export default ProblemsAndSolutions