import NotFoundImage from "@/components/NotFoundImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div
        className="flex items-center justify-center w-full m-auto overflow-hidden"
        // data-theme="fantasy"
      >
        <div className="hidden md:flex md:w-1/2 p-8">
          <NotFoundImage />
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">404 Not Found</h1>
          <p className="text-lg md:text-xl  mb-8">
            Oops! The page you are looking for could not be found.
          </p>
          <Link href="/">
            <Button className="btn-wide" size={"lg"}>
              Go To Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
