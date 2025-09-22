import { useParams, Link } from "react-router-dom"
import useSolutionsStore from '../store/solutionsStore'
import { ArrowLeft, Calendar, Tag, Code2 } from "lucide-react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {prism} from "react-syntax-highlighter/dist/esm/styles/prism"
import MarkdownRenderer from "../components/ui/MarkdownRenderer"
import { Edit, Trash } from "lucide-react"

function SolutionDetails() {
    const {id} = useParams();
    const solution = useSolutionsStore((state) =>
        state.solutions.find ((s) => s.id === Number(id))
    )
    const deleteSolution = useSolutionsStore((state) => state.deleteSolution);

    if(!solution){
        return (
    <div className="p-6">
        <Link to="/solution" className="text-blue-600 hover:underline">← Back</Link>
        <p className="mt-4">Solution not found.</p>
      </div> 
        )
    }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/solution" className="flex items-center  text-blue-600 hover:underline cursor-pointer">
        <ArrowLeft className="mr-2" /> Back to Solutions
      </Link>
      <div className= " flex items-center gap-4">
          <button
          type="button"
          className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-100 hover:text-red-700 hover:border-red-500 cursor-pointer"
          onClick={() => deleteSolution(solution.id)}
          >
            <Trash className="inline-block mr-2 size-4" />
            Delete Solution
          </button>
        <Link to={`/solution/${solution.id}/edit`}>
             <button 
          className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          type="button">
            <Edit className="inline-block mr-2 size-4" />
            Edit
          </button>
          </Link>
      </div>
          
        
      </div>
            
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">{solution.title}</h1>
        <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-slate-200 rounded-lg">{solution.status}</span>
            <span className="px-3 py-1 bg-slate-200 rounded-lg">{solution.difficulty}</span>
      </div>
      </div>
      
      <p className="text-gray-700 mb-4 text-xl">{solution.description}</p>

      <div className="text-sm text-gray-500 flex gap-2 items-center mb-2">
        <Calendar className="size-4" /> <p>Created: {solution.date}</p>
      </div>
      <section> 
        {solution.tags.map((tag) => (
          <Link
            key={tag}
            to={`/solution?tag=${encodeURIComponent(tag)}`}
            className="inline-block text-sm px-3 py-1 rounded-full mr-2 mb-2 border border-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
          >
            <Tag className="inline-block size-3 mr-1" />
            {tag}
          </Link>
        ))}
      </section>
      <section className="mb-6 mt-4">
        <h2 className="text-lg font-semibold mb-2">Problem Description</h2>
        <MarkdownRenderer content={solution.problemDescription} />
        {/* <p>{solution.problemDescription}</p> */}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Solution Steps</h2>
        <MarkdownRenderer content={solution.solutionSteps} />
        {/* <p>{solution.solutionSteps}</p> */}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Code Snippets</h2>
        {solution.codeSnippets.length === 0 ? (
          <p className="text-gray-500">No code snippets added.</p>
        ) : (
          solution.codeSnippets.map((snippet) => (
            <div key={snippet.id} className="mb-4 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{snippet.title || "Untitled snippet"}</h3>
              
              <SyntaxHighlighter language={snippet.language} style={prism} className="rounded-lg">
                {snippet.code}
              </SyntaxHighlighter>
              <p className="text-sm mt-2 text-gray-500">Language: {snippet.language}</p>
            </div>
          ))
        )}
      </section> 
    </div>
  )
}

export default SolutionDetails