import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useConfirm } from "@/hooks/use-confirm"
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useDeleteTask } from "../api/use-delete-task"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useEditTaskModal } from "../hooks/use-edit-task-modal"

interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}


export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()

  const { open } = useEditTaskModal()
  const [ConfirmDialog, confirm ] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task?",
    "destructive"
  )

  const { mutate, isPending } = useDeleteTask()

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) {
      return
    }
    mutate({ param: { taskId: id } })
  }

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }


  return (
    <div className="flex justify-end">
      <ConfirmDialog/>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTask} disabled={false} className="font-medium p-[10px] cursor-pointer">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenProject} disabled={false} className="font-medium p-[10px] cursor-pointer">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => open(id)} disabled={false} className="font-medium p-[10px] cursor-pointer">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} disabled={isPending} className="text-rose-700 focus:text-rose-700 font-medium cursor-pointer p-[10px]">
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}