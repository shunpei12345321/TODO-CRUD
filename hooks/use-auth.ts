"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 初期認証状態を取得
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // ログイン成功時にダッシュボードにリダイレクト
      if (event === "SIGNED_IN" && session?.user) {
        window.location.href = "/dashboard"
      }

      // ログアウト時にログインページにリダイレクト
      if (event === "SIGNED_OUT") {
        window.location.href = "/login"
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return { user, loading }
}
