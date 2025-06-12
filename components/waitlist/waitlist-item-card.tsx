import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WaitListItemResponse } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

interface WaitlistItemCardProps {
  item: WaitListItemResponse
}

export function WaitlistItemCard({ item }: WaitlistItemCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ru })

  return (
    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={`Waitlist item ${item.id}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?width=400&height=533"
            }}
          />
          <Badge
            variant={item.status === "pending" ? "default" : "secondary"}
            className="absolute top-2 right-2 capitalize"
          >
            {item.status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-white dark:bg-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Добавлено {timeAgo}</p>
      </CardFooter>
    </Card>
  )
}
