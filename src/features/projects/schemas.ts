import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Workspace name required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
    workspaceId: z.string()
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(3, "Minimum 3 character requierd").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});