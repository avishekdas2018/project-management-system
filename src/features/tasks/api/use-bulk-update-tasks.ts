import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>;

export const useBulkUpdateTasks = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType >({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"]["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Tasks updated successfully");
      //router.refresh()
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      //queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    }
  })

  return mutation;
}