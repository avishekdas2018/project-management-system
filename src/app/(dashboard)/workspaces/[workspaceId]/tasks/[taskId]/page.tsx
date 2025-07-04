import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

const TasksIdPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <TaskIdClient/>
    </div>
  );
}
export default TasksIdPage;