"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // 強制的にログインページにリダイレクト
    window.location.href = "/login"
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      ログアウト
    </Button>
  )
}
