"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2, Bot } from "lucide-react"
import { apiChat, type ChatMessage as ApiChatMessage, type ChatResponse } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const initialPrompt = searchParams.get("prompt")
    if (initialPrompt === "new_outfit") {
      const predefinedMessage = "Помоги мне подобрать новый образ."
      setInput(predefinedMessage)
      // Optionally, auto-submit this message
      // handleSendMessage(predefinedMessage);
    }
  }, [searchParams])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSendMessage = async (messageContent?: string) => {
    const currentMessage = messageContent || input.trim()
    if (!currentMessage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const apiMsg: ApiChatMessage = { message: currentMessage }
      const response: ChatResponse = await apiChat(apiMsg)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Chat API error:", error)
      toast({
        title: "Ошибка AI Ассистента",
        description: error.message || "Не удалось получить ответ от ассистента.",
        variant: "destructive",
      })
      // Optionally add an error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, произошла ошибка. Попробуйте позже.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSendMessage()
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return "U"
    const parts = email.split("@")[0].split(/[._-]/)
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <header className="p-4 border-b dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI Ассистент</h2>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end space-x-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sky-500 text-white">
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white rounded-br-none"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png?size=32`} alt={user.email} />
                  <AvatarFallback className="bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-end space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sky-500 text-white">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin text-slate-500 dark:text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-slate-700 flex items-center space-x-3">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Спросите что-нибудь..."
          className="flex-1 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-sky-500 dark:focus:border-sky-500"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-sky-500 hover:bg-sky-600">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">Отправить</span>
        </Button>
      </form>
    </div>
  )
}
