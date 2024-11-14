"use client"
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader, PlusIcon } from "lucide-react"
import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { useGetTasks } from "../api/use-get-tasks"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { DataFilters } from "@/features/tasks/components/data-filters"
import { useQueryState } from "nuqs"
import { useTaskFilters } from "../hooks/use-task-filters"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { DataKanban } from "./data-kanban"
import { TaskStatus } from "../types"
import { useCallback } from "react"
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks"
import { DataCalendar } from "./data-calendar"
import { useProjectId } from "@/features/projects/hooks/use-project-id"


interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean
}
export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const { open } = useCreateTaskModal()
  const [{
    status,
    projectId,
    assigneeId,
    dueDate
  }] = useTaskFilters()

  const [ view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  })
  const { mutate: bulkUpdate } = useBulkUpdateTasks()
  const workspaceId = useWorkspaceId()
  const paramProjectId = useProjectId()

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: projectId || paramProjectId,
    status,
    assigneeId,
    dueDate
  })

  const onKanbanChange = useCallback((
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => {
    bulkUpdate({
      json: { tasks }
    })
  }, [bulkUpdate])


  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full border rounded-lg">
      <div className="flex flex-col h-full overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} className="w-full lg:w-auto" size="sm">
            <PlusIcon className="mr-1.5 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
          <DataFilters hideProjectFilter={hideProjectFilter}/>
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex w-full rounded-lg h-[200px] flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full">
              <DataCalendar data={tasks?.documents ?? []}/>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
