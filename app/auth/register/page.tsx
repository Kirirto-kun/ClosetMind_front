"use client"
import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">ClosetMind AI</h1>
          <p className="mt-2 text-lg text-slate-300">Создайте аккаунт</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-slate-400">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="font-medium text-sky-400 hover:text-sky-300">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
