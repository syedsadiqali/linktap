"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Messages() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const status = searchParams.get("status");
  return (
    <>
      {error && (
        <>
          <p className="p-4 mb-2 rounded-md border bg-red-200 border-red-300 text-gray-800 text-center text-sm">
            {error}{" "}
            {status === "NOT_ON_WAITLIST_YET" ? (
              <Link href="/" className="underline font-bold"> Please waitlist here </Link>
            ) : (
              ""
            )}
          </p>
        </>
      )}
      {message && (
        <p className="p-4 rounded-md border bg-green-200 border-green-300 text-gray-800 text-center text-sm">
          {message}
        </p>
      )}
    </>
  );
}
