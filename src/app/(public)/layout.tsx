import { Suspense } from "react";

export default async function Layout({ children }: any) {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <main className="">{children}</main>
    </Suspense>
  );
}
