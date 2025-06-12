"use client"

import { useState, useEffect, useCallback } from "react"
import { apiGetWaitlistItems, type WaitListItemResponse } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/common/page-header"
import { AddWaitlistItemDialog } from "@/components/waitlist/add-item-dialog"
import { WaitlistItemCard } from "@/components/waitlist/waitlist-item-card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/empty-state"
import { ShoppingBag, PlusCircle } from "lucide-react"

export default function WaitlistPage() {
  const [items, setItems] = useState<WaitListItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedItems = await apiGetWaitlistItems()
      setItems(fetchedItems)
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки списка желаний",
        description: error.message || "Не удалось получить список.",
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
      <PageHeader title="Список Желаний" description="Сохраняйте идеи для будущих покупок.">
        <AddWaitlistItemDialog onOpenChange={setIsDialogOpen} open={isDialogOpen} onSave={fetchItems}>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            Добавить идею
          </button>
        </AddWaitlistItemDialog>
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
            <WaitlistItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          Icon={ShoppingBag}
          title="Ваш список желаний пуст"
          description="Добавляйте сюда скриншоты или ссылки на вещи, которые вам понравились."
          actionText="Добавить первую идею"
          onActionClick={() => setIsDialogOpen(true)}
        />
      )}
    </div>
  )
}
