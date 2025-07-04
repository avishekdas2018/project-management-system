import { Project } from "@/features/projects/types";
import { Task } from "../types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TaskBreadcrumbsProps {
  task: Task;
  project: Project;
}

export const TaskBreadcrumbs = ({ task, project }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const { mutate, isPending } = useDeleteTask()
  const [ConfirmDialog, Confirm ] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task?",
    "destructive"
  )

  const handleDeleteTask = async () => {
    const ok = await Confirm()
    if (!ok) {
      return
    }
    mutate({ param: { taskId: task.$id } },  {
      onSuccess: () => {
        toast.success("Task deleted successfully")
        router.push(`/workspaces/${workspaceId}/tasks`)
      }
    })
  }
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog/>
      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-medium text-muted-foreground hover:opacity-90 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">
        {task.name}
      </p>
      <Button disabled={isPending} onClick={handleDeleteTask} className="ml-auto" variant={"destructive"} size={"sm"}>
        <Trash2Icon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};