import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useSolutionsStore from "../store/solutionsStore";
import Basic_info from "../components/ui/add-new-solution ui/Basic_info";
import ProblemsAndSolutions from "../components/ui/add-new-solution ui/Problems&Solutions";
import AddTags from "../components/ui/add-new-solution ui/AddTags";
import CodeSnippets from "../components/ui/add-new-solution ui/CodeSnippets";

function EditSolution() {
  const { id } = useParams();
  const navigate = useNavigate();
 const solutions = useSolutionsStore((state) => state.solutions);
const editSolution = useSolutionsStore((state) => state.editSolution);

  const solution = solutions.find((s) => s.id === id);

  const methods = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    if (solution) {
      methods.reset(solution);
    }
  }, [solution, methods]);

  const onSubmit = (data) => {
    editSolution(solution.id, data);
    navigate(`/solution/${solution.id}`);
  };

  if (!solution) {
    return <p>Solution not found</p>;
  }

  return (
    <div className="p-6">
      <Link to={`/solution/${id}`} className="text-blue-600 hover:underline">← Back to Solution</Link>
      <h1 className="text-2xl font-bold mb-1">Edit Solution</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Basic_info />
          <ProblemsAndSolutions />
          <CodeSnippets />
          <AddTags />
          <section className="mt-8 flex justify-between">
            <button
              onClick={() => navigate(`/solution/${id}`)}
              className="border border-gray-500 p-2 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-gray-500 p-2 rounded-lg hover:bg-slate-100"
            >
              Save Changes
            </button>
          </section>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditSolution;
