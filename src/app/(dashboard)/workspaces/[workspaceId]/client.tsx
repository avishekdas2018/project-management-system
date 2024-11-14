"use client"

import { Analytics } from "@/components/analytics"
import { DottedSeparator } from "@/components/dotted-separator"
import { PageError } from "@/components/page-error"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/use-get-members"
import MemberAvatar from "@/features/members/components/member-avatar"
import { Member } from "@/features/members/types"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { Project } from "@/features/projects/types"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal"
import { Task } from "@/features/tasks/types"
import { useGetworkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, Plus, PlusIcon, Settings2Icon } from "lucide-react"
import Link from "next/link"
import { GoTasklist } from "react-icons/go"

export const WorkSpaceIdClient = () => {
  const workspaceId = useWorkspaceId()

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetworkspaceAnalytics({ workspaceId })
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })


  const isLoading = isLoadingAnalytics || isLoadingProjects || isLoadingTasks || isLoadingMembers

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (!analytics || !projects || !tasks || !members) {
    return (
      <PageError message="Failed to load workspace data,Please try again later" />
    )
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>

  )
}

interface TaskListProps {
  data: Task[]
  total: number
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal()
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="muted" size="icon" onClick={createTask} >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-80">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-sm text-muted-foreground">{task.project?.name}</p>
                      <div className="rounded-full bg-neutral-300 size-1" />
                      <div className="text-sm flex items-center text-muted-foreground">
                        <CalendarIcon className="size-3 mr-1 shrink-0" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No task found
          </li>
        </ul>
        <Button variant={"teritary"} className="w-full mt-4" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            <GoTasklist className="siz-6 mr-2" />
            Show all
          </Link>
        </Button>
      </div>
    </div>
  )
}



interface ProjectListProps {
  data: Project[]
  total: number
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal()
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject} >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-80">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg truncate font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  )
}


interface MembersListProps {
  data: Member[]
  total: number
}

export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild variant="secondary" size="icon" >
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings2Icon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-col-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              
                <Card className="shadow-none rounded-lg overflow-hidden">
                  <CardContent className="p-3 flex flex-col items-center gap-x-2">
                    <MemberAvatar
                      name={member.name}
                      className="size-12"
                    />
                    <div className="flex flex-col items-center overflow-hidden">
                      <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                    </div>
                  </CardContent>
                </Card>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  )
}