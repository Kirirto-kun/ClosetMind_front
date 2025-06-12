"use client"

import { useState, useEffect, useCallback } from "react"
import { apiGetWardrobeItems, type ClothingItemResponse } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/common/page-header"
import { AddWardrobeItemDialog } from "@/components/wardrobe/add-item-dialog"
import { ClothingItemCard } from "@/components/wardrobe/clothing-item-card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/empty-state"
import { Shirt, PlusCircle } from "lucide-react"

export default function WardrobePage() {
  const [items, setItems] = useState<ClothingItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedItems = await apiGetWardrobeItems()
      setItems(fetchedItems)
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки гардероба",
        description: error.message || "Не удалось получить список вещей.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return (
    <div className="space-y-8">
      <PageHeader title="Мой Гардероб" description="Просматривайте и управляйте вещами в вашем гардеробе.">
        <AddWardrobeItemDialog onOpenChange={setIsDialogOpen} open={isDialogOpen} onSave={fetchItems}>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            Добавить вещь
          </button>
        </AddWardrobeItemDialog>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ClothingItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          Icon={Shirt}
          title="Ваш гардероб пуст"
          description="Начните добавлять вещи, чтобы AI мог составлять для вас образы."
          actionText="Добавить первую вещь"
          onActionClick={() => setIsDialogOpen(true)}
        />
      )}
    </div>
  )
}
