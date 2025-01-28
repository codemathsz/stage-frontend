"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      captionLayout="dropdown"
      mode="single"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      fixedWeeks 
      classNames={{
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      components={{
        PreviousMonthButton:({ ...props }) => <button {...props}><ChevronLeft className="h-4 w-4" /></button>,
        NextMonthButton: ({ ...props }) => <button {...props}><ChevronRight className="h-4 w-4" /></button>,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }