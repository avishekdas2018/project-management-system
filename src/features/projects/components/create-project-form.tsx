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
import { createProjectSchema } from "../schemas"
import { useCreateProject } from "../api/use-create-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

interface CreateProjectFormProps {
  onCancel?: () => void
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending, reset} = useCreateProject()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : ""
    }

    mutate({form: finalValues}, {
      onSuccess: ({ data }) => {
        reset()
        //onCancel?.()
        router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
      }
    })
  }

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
    }
  }

  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator/>
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project name"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              <FormField control={form.control} name="image" render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image src={

                          field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                        } alt="Logo" fill className="object-cover"/>
                      </div>
                    ) : (
                      <Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400"/>
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm">Workspace Icon</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG, SVG or JPEG, max 1MB</p>
                      <input onChange={handleImageChange} type="file" accept=".jpg, .png, .svg, .jpeg "  className="hidden" ref={inputRef} disabled={isPending}/>
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
              )}/>
            </div>
            <DottedSeparator className="py-7"/>
            <div className="flex items-center justify-between">
              <Button className={cn(!onCancel && "invisible")} disabled={isPending} variant={"secondary"} size={"lg"} type="button" onClick={onCancel}>Cancel</Button>
              <Button disabled={isPending} size={"lg"} type="submit">Create project</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}