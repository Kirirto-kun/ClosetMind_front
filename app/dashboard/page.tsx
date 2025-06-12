"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Shirt, ShoppingBag, Zap, Download } from "lucide-react"

export default function DashboardPage() {
  const apiDownloadExtension = async () => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(["stub data"], { type: "application/zip" })
        resolve(blob)
      }, 500)
    })
  }

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Добро пожаловать в ClosetMind!
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Ваш персональный AI стилист и органайзер гардероба.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl transition-shadow dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">AI Ассистент</CardTitle>
            <MessageSquare className="h-6 w-6 text-sky-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Задайте вопрос, получите совет по стилю или подберите образ.
            </p>
            <Button asChild className="w-full bg-sky-500 hover:bg-sky-600">
              <Link href="/dashboard/chat">Начать чат</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Мой Гардероб</CardTitle>
            <Shirt className="h-6 w-6 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Добавляйте, просматривайте и управляйте вещами в вашем гардеробе.
            </p>
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Link href="/dashboard/wardrobe">Перейти в гардероб</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Список Желаний</CardTitle>
            <ShoppingBag className="h-6 w-6 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Сохраняйте идеи для будущих покупок и отслеживайте их.
            </p>
            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600">
              <Link href="/dashboard/waitlist">К списку желаний</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">Быстрые действия</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Начните работу с основными функциями.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3 dark:border-slate-700 dark:hover:bg-slate-700"
              asChild
            >
              <Link href="/dashboard/wardrobe?action=add">
                <Shirt className="mr-3 h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium">Добавить вещь</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">В ваш гардероб</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3 dark:border-slate-700 dark:hover:bg-slate-700"
              asChild
            >
              <Link href="/dashboard/waitlist?action=add">
                <ShoppingBag className="mr-3 h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Добавить в желания</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Сохранить идею</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3 dark:border-slate-700 dark:hover:bg-slate-700"
              asChild
            >
              <Link href="/dashboard/chat?prompt=new_outfit">
                <Zap className="mr-3 h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Подобрать образ</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">С помощью AI</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3 dark:border-slate-700 dark:hover:bg-slate-700"
              onClick={async () => {
                try {
                  const blob = await apiDownloadExtension()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "closetmind_extension.zip"
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                } catch (error) {
                  console.error("Failed to download extension:", error)
                  // toast({ title: "Ошибка", description: "Не удалось скачать расширение.", variant: "destructive" });
                }
              }}
            >
              <Download className="mr-3 h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium">Скачать расширение</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Для браузера</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
