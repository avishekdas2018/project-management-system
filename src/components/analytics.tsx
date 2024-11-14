// interface AnalyticsProps {
//     data?: {
//         thisMonthTasksCount: number,
//         lastMonthTasksCount?: number,
//         tasksCountDiff: number,
//         projectCount?: number,
//         projectDifference?: number,
//         thisMonthAssignedTasksCount: number,
//         lastMonthAssignedTasksCount?: number,
//         assignedTasksCountDiff: number,
//         thisMonthIncompleteTasksCount?: number,
//         lastMonthIncompleteTasksCount?: number,
//         incompleteTasksCountDiff?: number,
//         thisMonthBacklogTasksCount?: number,
//         lastMonthBacklogTasksCount?: number,
//         backlogTasksCountDiff?: number,
//         thisMonthCompletedTasksCount: number,
//         lastMonthCompletedTasksCount?: number,
//         completedTasksCountDiff: number,
//         thisMonthOverdueTasksCount: number,
//         lastMonthOverdueTasksCount?: number,
//         overdueTasksCountDiff: number,
//     }
//   }

import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { AnalyticsCard } from "./analytics-card"
import { DottedSeparator } from "./dotted-separator"


export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {


  return (
    <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-x-0.5">
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Task"
            value={data.thisMonthTasksCount}
            variant={data.tasksCountDiff > 0 ? "up" : "down"}
            increaseValue={data.tasksCountDiff}
          />
          
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Task"
            value={data.thisMonthAssignedTasksCount}
            variant={data.assignedTasksCountDiff > 0 ? "up" : "down"}
            increaseValue={data.assignedTasksCountDiff}
          />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Task"
            value={data.thisMonthCompletedTasksCount}
            variant={data.completedTasksCountDiff > 0 ? "up" : "down"}
            increaseValue={data.completedTasksCountDiff}
          />
          
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Task"
            value={data.thisMonthOverdueTasksCount}
            variant={data.overdueTasksCountDiff > 0 ? "up" : "down"}
            increaseValue={data.overdueTasksCountDiff}
          />
          
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Task"
            value={data.thisMonthIncompleteTasksCount}
            variant={data.incompleteTasksCountDiff > 0 ? "up" : "down"}
            increaseValue={data.incompleteTasksCountDiff}
          />
          
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}