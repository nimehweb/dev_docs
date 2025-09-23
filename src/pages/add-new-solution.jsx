import { ArrowLeft, EyeIcon, File, PlusIcon , X, Code2} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useSolutionsStore from "../store/solutionsStore"
import {useForm, FormProvider} from "react-hook-form"
import Basic_info from "../components/ui/add-new-solution ui/Basic_info"
import ProblemsAndSolutions from "../components/ui/add-new-solution ui/Problems&Solutions"
import AddTags from "../components/ui/add-new-solution ui/AddTags"
import CodeSnippets from "../components/ui/add-new-solution ui/CodeSnippets"

const defaultValues = {
  date: new Date().toISOString().split("T")[0],
  title: "",
  description: "",
  status: "Open",
  difficulty: "Easy",
  problemDescription: "",
  solutionSteps: "",
  codeSnippets: [],
  tags: []
};

function AddNewSolution(){

const addSolution = useSolutionsStore((state) => state.addSolution)
const navigate = useNavigate()

const methods = useForm({
    defaultValues
})

const onSubmit = (data) =>{
    const payload = { id: Date.now(), ...data };
    addSolution(payload);
    methods.reset(defaultValues);
    navigate("/solution");
    console.log(data)
}

    return(
        <div className="p-6">
            <div className="mb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg inline-block">
                <Link to= "/solution">   
                <ArrowLeft className="inline-block mr-2"/>
                <p className="inline font-semibold text-lg">Back to Solutions</p>
                </Link>
            </div>
            <div>
                <h1 className="text-2xl font-bold mb-1">Add New Solution</h1>
                <p className = "text-lg"> Document a new problem and its solution</p>
            </div>
            <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Basic_info />
                <ProblemsAndSolutions />
                <CodeSnippets />
                <AddTags />    
            <section className="mt-8">
                <div className="flex justify-between ">
                  <button onClick={() => navigate('/solution')} className="border border-gray-500 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer">Cancel</button>  
                  <button type="submit" className="border border-gray-500 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer">Publish Solution</button>
                </div>
            </section>
            </form>
            </FormProvider>
        </div>
    )
}



export default AddNewSolution