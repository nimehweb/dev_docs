import { ArrowLeft, EyeIcon, File, PlusIcon , X, Code2} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useSolutionsStore from "../store/solutionsStore"
import {useForm, FormProvider} from "react-hook-form"
import Basic_info from "../components/ui/add-new-solution ui/Basic_info"
import ProblemsAndSolutions from "../components/ui/add-new-solution ui/Problems&Solutions"
import AddTags from "../components/ui/add-new-solution ui/AddTags"
import CodeSnippets from "../components/ui/add-new-solution ui/CodeSnippets"

const defaultValues = {
  title: "",
  description: "",
  status: "open",
  difficulty: "easy",
  problemDescription: "",
  solutionSteps: "",
  code_Snippets: [],
  tags: []
};

function AddNewSolution(){

const addSolution = useSolutionsStore((state) => state.addSolution)
const navigate = useNavigate()

const methods = useForm({
    defaultValues
})

const onSubmit = (data) =>{
    addSolution(data);
    methods.reset(defaultValues);
    navigate("/solution");
}

    return(
        <div className="p-4 lg:p-6">
            <div className="mb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg inline-block">
                <Link to= "/solution">   
                <ArrowLeft className="inline-block mr-2"/>
                <p className="inline font-semibold text-base lg:text-lg">Back to Solutions</p>
                </Link>
            </div>
            <div>
                <h1 className="text-xl lg:text-2xl font-bold mb-1">Add New Solution</h1>
                <p className="text-sm lg:text-base"> Document a new problem and its solution</p>
            </div>
            <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Basic_info />
                <ProblemsAndSolutions />
                <CodeSnippets />
                <AddTags />    
            <section className="mt-8">
                <div className="flex justify-between ">
                  <button onClick={() => navigate('/solution')} className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer">Cancel</button>  
                  <button type="submit" className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer">
                    <span className="hidden sm:inline">Publish Solution</span>
                    <span className="sm:hidden">Publish</span>
                  </button>
                </div>
            </section>
            </form>
            </FormProvider>
        </div>
    )
}



export default AddNewSolution