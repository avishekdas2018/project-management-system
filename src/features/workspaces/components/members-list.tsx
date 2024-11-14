"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MoreVerticalIcon } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

export const MembersList = () => {
  const router =  useRouter()
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, Confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace. This action cannot be undone.",
    "destructive"
  )
  const { data, isLoading } = useGetMembers({ workspaceId })

  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember()
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()


  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    })
  }
  
  const handleDeleteMember = async (memberId: string) => {
    const ok = await Confirm()
    if (!ok) {
      return
    }

    deleteMember({
      param: { memberId },
    },)
  }

  return (
    <Card className="w-full h-full border-none">
      <ConfirmDialog/>
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size={"sm"} asChild variant={"secondary"}>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">
          Members list
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator/>
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar name={member.name} className="size-10" fallBackClassName="text-lg"/>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant={"secondary"} size={"icon"}>
                    <MoreVerticalIcon className="size-4 text-muted-foreground"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isUpdatingMember} className="font-medium">Set as Administrator</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isUpdatingMember} className="font-medium">Set as Member</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteMember(member.$id)} disabled={isDeletingMember} className="font-medium text-rose-700">Remove {member.name}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5"/>
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}