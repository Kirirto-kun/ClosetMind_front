import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { ClothingItemResponse } from "@/lib/api"

interface ClothingItemCardProps {
  item: ClothingItemResponse
}

export function ClothingItemCard({ item }: ClothingItemCardProps) {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?width=400&height=533"
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-white dark:bg-slate-800">
        <p className="font-semibold text-slate-800 dark:text-white truncate" title={item.name}>
          {item.name}
        </p>
      </CardFooter>
    </Card>
  )
}
