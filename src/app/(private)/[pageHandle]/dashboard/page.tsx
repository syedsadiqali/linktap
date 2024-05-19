import Dashboard from "./dashboard";
// export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { readonly pageHandle: string };
}) {
  return <Dashboard pageHandle={params.pageHandle} />;
}
