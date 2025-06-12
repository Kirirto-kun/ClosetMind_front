"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { apiCreateWardrobeItem } from "@/lib/api"
import { Loader2, ImageIcon, Type } from "lucide-react"

interface AddWardrobeItemDialogProps {
  children: ReactNode
  onSave: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWardrobeItemDialog({ children, onSave, open, onOpenChange }: AddWardrobeItemDialogProps) {
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!name || !imageUrl) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все поля.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      await apiCreateWardrobeItem({ name, image_url: imageUrl })
      toast({
        title: "Успех!",
        description: "Новая вещь добавлена в ваш гардероб.",
        className: "bg-green-100 dark:bg-green-800",
      })
      onSave() // Refresh the list
      onOpenChange(false) // Close dialog
      setName("")
      setImageUrl("")
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить вещь.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Добавить вещь в гардероб</DialogTitle>
          <DialogDescription>Введите информацию о новой вещи.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Напр., Синяя рубашка"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-url">URL изображения</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="pl-10"
              />
            </div>
          </div>
          {imageUrl && (
            <div className="flex justify-center">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Предпросмотр"
                width={150}
                height={200}
                className="rounded-lg object-cover border-2 border-slate-200 dark:border-slate-700"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block"
                }}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
