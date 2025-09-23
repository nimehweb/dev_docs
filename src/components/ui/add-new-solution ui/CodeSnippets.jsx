import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Code2, X } from 'lucide-react'

function CodeSnippets() {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "codeSnippets"
    });
    function onAppendSnippet() {
    append({ title: "", language: "javascript", code: "" });
  }
  return (
    <section className="my-6 p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
                <h2 className="text-xl font-semibold mb-2">Code snippets</h2>
                <p> Add code examples to illustrate your solution</p>  
            </div>
            <button
              type="button"
              onClick={onAppendSnippet}
              className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer px-3 py-1 "
            >
              <Plus /> Add Code Snippet
            </button>
          </div>

          {fields.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40">
                            <Code2 className="h-12 w-12 text-gray-300 mb-2"/>
                            <p className="text-gray-500">No code snippets added yet</p>
                            <p className="text-gray-500">Click "Add Code Snippet" to include code examples</p>
                        </div>          )}

          {fields.map((field, index) => (
            <div key={field.id} className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-3">
              <div className="flex gap-2 items-center mb-4">
                <input
                  {...register(`codeSnippets.${index}.title`)}
                  placeholder="Snippet title (e.g., Before: infinite loop)"
                  className="flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded-lg "
                />

                <select
                  {...register(`codeSnippets.${index}.language`)}
                  className="border border-gray-300 dark:border-gray-700 px-2 py-1 rounded w-40"
                >
                  <option value="javascript">Javascript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="ruby">Ruby</option>
                  <option value="html">SQL</option>
                </select>

                <button
                  type="button"
                  className="hover:bg-slate-100 dark:hover:bg-slate-500 p-2 rounded-lg"
                  onClick={() => remove(index)}
                >
                  <X />
                </button>
              </div>

              <textarea
                {...register(`codeSnippets.${index}.code`)}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg font-mono"
                rows={6}
                placeholder="Paste your code here..."
              />
            </div>
          ))}
        </section>
  )
}

export default CodeSnippets