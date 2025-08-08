// app/api/memos/route.ts

import { NextResponse } from "next/server";
import { MemoRepository } from "@/app/_repositories/Memo";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaSingleton";

// メモ作成リクエストボディの型定義
interface MemoCreateRequestBody {
	title: string;
	items?: string | null;
	textContent?: string | null;
	images?: string | null;
	urls?: string | null;
	type: "checklist" | "text";
}
// memosになってるため
// ✅ GET: 全メモを取得（Prisma経由）
export async function GET() {
	try {
		const memo = await MemoRepository.findMany();
		return NextResponse.json(memo, { status: 200 });
	} catch (error) {
		console.error("メモの取得に失敗:", error);
		return NextResponse.json(
			{
				message: "取得エラー",
				error: error instanceof Error ? error.message : "不明なエラー",
			},
			{ status: 500 }
		);
	}
}

// ✅ POST: 新しいメモを作成（Prisma経由）
export async function POST(request: Request) {
	try {
		// Supabaseから認証情報を取得
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "認証が必要です" },
				{ status: 401 }
			);
		}

		const body: MemoCreateRequestBody = await request.json();

		// バリデーション
		if (!body.title || body.title.trim() === "") {
			return NextResponse.json(
				{ error: "タイトルは必須です" },
				{ status: 400 }
			);
		}
		if (!["checklist", "text"].includes(body.type)) {
			return NextResponse.json({ error: "タイプが不正です" }, { status: 400 });
		}

		// データベースからユーザーIDを取得
		const dbUser = await prisma.user.findUnique({
			where: { supabaseId: user.id }
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: "ユーザーが見つかりません" },
				{ status: 404 }
			);
		}

		const newMemo = await MemoRepository.create({
			title: body.title,
			items: body.type === "checklist" ? body.items ?? "" : "",
			textContent: body.type === "text" ? body.textContent ?? "" : "",
			images: body.images ?? "",
			urls: body.urls ?? "",
			type: body.type,
			userId: dbUser.id,
		});

		return NextResponse.json(newMemo, { status: 201 });
	} catch (error) {
		console.error("メモ作成失敗:", error);
		return NextResponse.json(
			{
				message: "作成エラー",
				error: error instanceof Error ? error.message : "不明なエラー",
			},
			{ status: 500 }
		);
	}
}

// ✅ DELETE: IDで削除（Prisma経由）
export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "メモIDが必要です" }, { status: 400 });
		}

		const deleted = await MemoRepository.deleteById(Number(id));
		return NextResponse.json({ message: "削除成功", deleted }, { status: 200 });
	} catch (error) {
		console.error("削除失敗:", error);
		return NextResponse.json(
			{
				message: "削除エラー",
				error: error instanceof Error ? error.message : "不明なエラー",
			},
			{ status: 500 }
		);
	}
}
