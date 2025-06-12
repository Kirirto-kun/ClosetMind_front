"use client"

import type React from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { apiAddWaitlistItem, apiUploadWaitlistScreenshot } from "@/lib/api"
import { Loader2, LinkIcon, Upload } from "lucide-react"
import Image from "next/image"

interface AddWaitlistItemDialogProps {
  children: ReactNode
  onSave: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWaitlistItemDialog({ children, onSave, open, onOpenChange }: AddWaitlistItemDialogProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const resetState = () => {
    setImageUrl("")
    setBase64Image(null)
    setFileName("")
    setIsLoading(false)
  }

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState()
    }
    onOpenChange(isOpen)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBase64Image(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitUrl = async () => {
    if (!imageUrl) return
    setIsLoading(true)
    try {
      await apiAddWaitlistItem({ image_url: imageUrl })
      toast({ title: "Успех!", description: "Идея добавлена в список желаний." })
      onSave()
      handleDialogChange(false)
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitUpload = async () => {
    if (!base64Image) return
    setIsLoading(true)
    try {
      await apiUploadWaitlistScreenshot({ image_base64: base64Image })
      toast({ title: "Успех!", description: "Скриншот загружен и добавлен в список." })
      onSave()
      handleDialogChange(false)
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Добавить в список желаний</DialogTitle>
          <DialogDescription>Добавьте идею по ссылке или загрузите скриншот.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">По ссылке</TabsTrigger>
            <TabsTrigger value="upload">Загрузить</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">URL изображения</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="pl-10"
                />
              </div>
            </div>
            <DialogFooter className="pt-6">
              <Button
                onClick={handleSubmitUrl}
                disabled={isLoading || !imageUrl}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Добавить по ссылке
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="upload" className="py-4">
            <div className="space-y-4">
              <Label htmlFor="screenshot-upload">Файл скриншота</Label>
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {fileName || "Перетащите файл или нажмите для выбора"}
                </p>
                <Input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {base64Image && (
                <div className="flex justify-center">
                  <Image
                    src={base64Image || "/placeholder.svg"}
                    alt="Предпросмотр"
                    width={150}
                    height={200}
                    className="rounded-lg object-contain border-2 border-slate-200 dark:border-slate-700"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="pt-6">
              <Button
                onClick={handleSubmitUpload}
                disabled={isLoading || !base64Image}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Загрузить и сохранить
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
