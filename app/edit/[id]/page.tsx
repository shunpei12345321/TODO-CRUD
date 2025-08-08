export const dynamic = "force-dynamic";

import EditScreen from "./_components/EditScreen";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);
  return <EditScreen userId={userId} />;
}
// export default async function EditUserPage({ params }) {
//   const userId = Number(params.id);
//   return <EditScreen userId={userId} />;
// }

// ここも書き換える必要があるparams を await
// でないと警告が出る
// .eslintrc.jsを作成して、"noImplicitAny": falseにした
