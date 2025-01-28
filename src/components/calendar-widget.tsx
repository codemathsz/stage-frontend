import { Calendar } from "@/components/ui/calendar"

export function CalendarWidget() {
  const today = new Date()

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Today's Date</h2>
      <Calendar mode="single" selected={today} className="flex justify-center items-center" />
    </div>
  )
}