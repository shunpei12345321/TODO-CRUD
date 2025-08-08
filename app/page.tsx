import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            マイアプリへようこそ
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Supabase認証機能付きNext.jsアプリ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>Supabaseによる安全な認証</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
