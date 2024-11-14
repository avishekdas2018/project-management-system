import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters long"),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "Workspace ID is required"),
  projectId: z.string().trim().min(1, "Project ID is required"),
  dueDate: z.coerce.date().min(new Date(), "Due date must be in the future"),
  assigneeId: z.string().trim().min(1, "Assignee ID is required"),
  description: z.string().optional(),
})