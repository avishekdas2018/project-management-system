"use client"

import { ResponsiveModal } from "@/components/responsive-modal"
import { CreateWorksSpaceForm } from "./create-works-space"
import { useCreateWorkspaceModal } from "../hooks/use-workspace-modal"

export const CreateWorksSpaceModal = () => {
  const  { isOpen, setIsOpen,close } = useCreateWorkspaceModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorksSpaceForm onCancel={close}/>
    </ResponsiveModal>
  )
}