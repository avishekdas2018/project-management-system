"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DottedSeparator } from "@/components/dotted-separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRef } from "react"
import Image from 'next/image';
import { ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createProjectSchema } from "../../projects/schemas"
import { useCreateProject } from "../../projects/api/use-create-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { createTaskSchema } from "../schemas"
import { useCreateTask } from "../api/use-create-task"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemberAvatar from "@/features/members/components/member-avatar"
import { TaskStatus } from "../types"
import ProjectAvatar from "@/features/projects/components/project-avatar"

interface CreateTaskFormProps {
  onCancel?: () => void,
  projectOptions: {
    id: string
    name: string
    imageUrl: string
  }[],

  memberOptions: {
    id: string
    name: string
  }[]
}

export const CreateTaskForm = ({ onCancel, projectOptions, memberOptions }: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending, reset } = useCreateTask()

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId
    }
  })

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {

    mutate({ json: { ...values, workspaceId } }, {
      onSuccess: () => {
        reset()
        onCancel?.()
        //TODO: redirect to new task
      }
    })
  }


  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter task name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="assigneeId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {memberOptions.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-x-2">
                            <MemberAvatar className="size-6" name={member.name} />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectItem value={TaskStatus.BACKLOG}>
                        Backlog
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_REVIEW}>
                        In Review
                      </SelectItem>
                      <SelectItem value={TaskStatus.TODO}>
                        Todo
                      </SelectItem>
                      <SelectItem value={TaskStatus.DONE}>
                        Done
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="projectId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {projectOptions.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-x-2">
                            <ProjectAvatar image={project.imageUrl} className="size-6" name={project.name} />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button className={cn(!onCancel && "invisible")} disabled={isPending} variant={"secondary"} size={"lg"} type="button" onClick={onCancel}>Cancel</Button>
              <Button disabled={isPending} size={"lg"} type="submit">Create Task</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}