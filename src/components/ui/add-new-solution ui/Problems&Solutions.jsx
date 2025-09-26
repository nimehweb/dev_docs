import { useState, useEffect, useRef, use } from "react"
import { useFormContext } from "react-hook-form"
import { EyeIcon, File } from "lucide-react"
import MarkdownRenderer from "../MarkdownRenderer"

function ProblemsAndSolutions() {
  const { register, watch } = useFormContext()
  const [mode, setMode] = useState("edit")

  const problemText = watch("problemDescription") || ""
  const solutionText = watch("solutionSteps") || ""

  // auto-resize helper
  const autoResize = (el) => {
    if (el) {
      el.style.height = "auto"
      el.style.height = el.scrollHeight + "px"
    }
  }
 const problemRef = useRef(null)
 const solutionRef = useRef(null)

 useEffect(() => {
    if (mode === "edit") {
   autoResize(problemRef.current)
   autoResize(solutionRef.current)
    }
 },[mode,problemText, solutionText])
  
  return (
    <section className="Problems&Solutions my-6 p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Problem & Solution</h2>
          <p> Detailed description of problem and how to solve it</p>
        </div>
        <div className="flex gap-4">
          <div
            onClick={() => setMode("edit")}
            className={`p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer ${mode === "edit" ? "bg-slate-100 dark:bg-slate-500" : ""}`}
          >
            <File className="inline-block mr-2" />
            Edit
          </div>
          <div
            onClick={() => setMode("preview")}
            className={`p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer ${mode === "preview" ? "bg-slate-100 dark:bg-slate-500" : ""}`}
          >
            <EyeIcon className="inline-block mr-2" />
            Preview
          </div>
        </div>
      </div>

      {/* Problem */}
      {mode === "edit" ? (
        <div className="mb-4">
          <label className="block mb-2 font-medium"> Problem Description</label>
          <textarea
            {...register("problemDescription")}
            ref={(el) => {
            problemRef.current = el
            register("problemDescription").ref(el) // forward ref to RHF
            }}
            onInput={(e) => autoResize(e.target)}
            id="problemDescription"
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg overflow-hidden "
            rows={4}
            name = "problemDescription"
            placeholder="Describe the problem in detail. You can use Markdown formatting..."
          />
          <p className="text-xs text-muted-foreground">
                      Supports Markdown: **bold**, *italic*, `code`, # headings
         </p>
        </div>
      ) : (
        <div>
          <label className="block mb-2 font-medium"> Problem Preview</label>
          <MarkdownRenderer mode={mode} content={problemText} />
        </div>
      )}

      {/* Solution */}
      {mode === "edit" ? (
        <div>
          <label className="block mb-2 font-medium"> Solution Steps</label>
          <textarea
            {...register("solutionSteps")}
            ref={(el) => {
                solutionRef.current = el
                register("solutionSteps").ref(el) // forward ref to RHF
           }}
            onInput={(e) => autoResize(e.target)}
            id="solutionSteps"
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg overflow-hidden "
            rows={4}
            name = "solutionSteps"
            placeholder="Provide step-by-step solution. You can use Markdown formatting..."
          />
          <p className="text-xs text-muted-foreground">
                      Supports Markdown: **bold**, *italic*, `code`, # headings
         </p>
        </div>
      ) : (
        <div>
          <label className="block mb-2 font-medium"> Solution Preview</label>
          <MarkdownRenderer content={solutionText} />
        </div>
      )}
    </section>
  )
}

export default ProblemsAndSolutions
