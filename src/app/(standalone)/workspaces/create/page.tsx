import { getCurrent } from "@/features/auth/queries";
import { CreateWorksSpaceForm } from "@/features/workspaces/components/create-works-space";
import { redirect } from "next/navigation";

const WorkspaceCreatePage = async () => {
  const user = await getCurrent()

  if (!user) {
    redirect("/sign-in")
  }
  
  return ( 
    <div className="w-full lg:max-w-xl">
      <CreateWorksSpaceForm/>
    </div>
  );
}
export default WorkspaceCreatePage;