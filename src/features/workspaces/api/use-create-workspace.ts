import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const mutation = useMutation<ResponseType, Error, RequestType >({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({form});

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Workspace created successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    }
  })

  return mutation;
}