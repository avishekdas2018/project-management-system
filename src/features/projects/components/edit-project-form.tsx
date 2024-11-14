"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { updateProjectSchema } from "../schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DottedSeparator } from "@/components/dotted-separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRef } from "react"
import Image from 'next/image';
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Project } from "../types"

import { useConfirm } from "@/hooks/use-confirm"
import { useUpdateProject } from "../api/use-update-project"
import { useDeleteProject } from "../api/use-delete-project"

interface EditProjectFormProps {
  onCancel?: () => void
  initialValues: Project
}

export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {
  const { mutate, isPending, reset } = useUpdateProject()
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject()

  const [DeleteDialog, confirmDelete] = useConfirm("Delete Project", "Are you sure you want to delete this project?", "destructive")

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    }
  })


  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) {
      return
    }

    deleteProject({ param: { projectId: initialValues.$id } }, {
      onSuccess: () => {
        window.location.href = `/workspaces/${initialValues.workspaceId}`
      }
    })
  }

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    }

    mutate({ form: finalValues, param: { projectId: initialValues.$id } })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
    }
  }


  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button variant="secondary" size="sm" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
            <ArrowLeftIcon className="size-4 mr-2" />Back
          </Button>
          <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="image" render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image src={
                            field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                          } alt="Logo" fill className="object-cover" />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">JPG, PNG, SVG or JPEG, max 1MB</p>
                        <input onChange={handleImageChange} type="file" accept=".jpg, .png, .svg, .jpeg " className="hidden" ref={inputRef} disabled={isPending} />
                        {field.value ? (
                          <Button variant={"destructive"} disabled={isPending} size="xs" type="button" className="w-fit mt-2" onClick={() => {
                            field.onChange(null);
                            if (inputRef.current) {
                              inputRef.current.value = ""
                            }
                          }}>Remove image</Button>
                        ) : (
                          <Button variant={"teritary"} disabled={isPending} size="xs" type="button" className="w-fit mt-2" onClick={() => inputRef.current?.click()}>Upload image</Button>
                        )}
                      </div>
                    </div>
                  </div>
                )} />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button className={cn(!onCancel && "invisible")} disabled={isPending} variant={"secondary"} size={"lg"} type="button" onClick={onCancel}>Cancel</Button>
                <Button disabled={isPending} size={"lg"} type="submit">Save changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>


      <Card className="w-full h-full border-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this workspace will remove all of its data and cannot be undone.
            </p>
            <DottedSeparator className="py-7" />
            <Button onClick={handleDelete} variant={"destructive"} type="button" disabled={isPending || isDeletingProject} className="mt-6 w-fit ml-auto">Delete Project</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}