import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation =  useMutation<ResponseType, Error, RequestType >({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({json});
      
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registered successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error:Error, {json}) => {
      if (error.name === "user_already_exists") {
        return toast.error(error.message, {
          description: "Please check your email and password and try again.",
        });
        
      }
    }
  })

  return mutation;
}