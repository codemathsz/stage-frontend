import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineHeaderProps {
  title: string
  location: string
  projectId: string
}

export function TimelineHeader({ title, location, projectId }: TimelineHeaderProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <span className="text-sm text-muted-foreground">{projectId}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-sm font-medium">{location}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Total Duration:</span> 53 weeks (13.3 months)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

