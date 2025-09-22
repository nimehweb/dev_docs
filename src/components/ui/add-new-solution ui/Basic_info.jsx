import React from 'react'
import {useFormContext} from "react-hook-form"


function Basic_info() {
    const {register, formState: {errors}} = useFormContext()
    return (
   <section className="Basic_info my-6 p-6 border border-gray-300 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                <p> Provide essential details about your solution</p>
                    <div className="my-4">
                        <label className="block mb-2 font-medium" htmlFor="title">Title*</label>
                        <input 
                        className="w-full border border-gray-300 p-2 rounded-lg" 
                        type="text"  name="title" 
                        {...register("title", {required: "Title is required", minLength: {value: 5, message: "Title must be at least 5 characters"}})}
                        placeholder="e.g., Fix React useEffect infinite loop"/>
                        {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium" htmlFor="description">Description*</label>
                        <textarea  
                        className="w-full border border-gray-300 p-2 rounded-lg" 
                         name="description" {...register("description", {required: "Description is required", minLength: {value: 10, message: "Description must be at least 10 characters"}})}
                         rows="4" placeholder="Briefly describe the problem and solution"></textarea>
                         {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="mb-4 flex gap-20">
                        <div className="flex flex-col">
                            <label htmlFor="status" className="block mb-2 font-medium"> Status*</label>
                            <select name="status" {...register("status")} className="block w-40 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="open">Open</option>
                                <option value="resolved">Resolved</option>
                            </select>

                        </div>
                        <div className="flex flex-col">
                            <label htmlFor= "Difficulty" className="block mb-2 font-medium">Difficulty</label>
                            <select {...register("difficulty")} name="difficulty" className="block w-40 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                        </div>
                    </div>
    </section>
  )
}

export default Basic_info