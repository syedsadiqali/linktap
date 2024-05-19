import { LinkCard } from "@/components/link-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LinksRow, PagesRow } from "@/types/utils";
import Link from "next/link";
import LinkTapLogo from "./LinkTapLogo";
import ContentLoader from "react-content-loader";

export default function PublicPage({
  pageDetails,
  links,
  isPreview,
  avatarUrl,
  theme,
  className,
  isSuspenseLoading,
}: {
  pageDetails?: PagesRow;
  links?: Partial<LinksRow>[];
  isPreview?: boolean;
  theme?: string;
  avatarUrl?: string;
  className?: string;
  isSuspenseLoading?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center pt-16 w-full h-full ${className}`}
      data-theme={theme || "light"}
    >
      {isSuspenseLoading ? (
        <ContentLoader
          speed={1}
          width={"78"}
          height={100}
          viewBox="0 0 78 78"
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
          className="rounded-md"
        >
          <circle cx="38" cy="38" r="38" />
        </ContentLoader>
      ) : (
        <Avatar variant={"xl"}>
          <AvatarImage src={avatarUrl as string} />
          <AvatarFallback>
            {getInitials(pageDetails?.page_name as string)}
          </AvatarFallback>
        </Avatar>
      )}

      {isSuspenseLoading ? (
        <ContentLoader
        speed={1}
          width={"100"}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
          className="rounded-md"
        >
          <rect x="0" y="0" rx="3" ry="3" width="100" height="24" />
        </ContentLoader>
      ) : (
        <div className="text-lg font-semibold">@{pageDetails?.page_handle}</div>
      )}

      {isSuspenseLoading ? (
        <ContentLoader
          width={"260"}
          height={100}
          viewBox="0 0 260 20"
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
          className="rounded-md"
        >
          <rect x="45" y="35" rx="3" ry="3" width="178" height="19" />
          <rect x="14" y="67" rx="3" ry="3" width="235" height="19" />
          <rect x="4" y="99" rx="3" ry="3" width="260" height="19" />
        </ContentLoader>
      ) : (
        <div
          className={`${
            isPreview ? `lg:w-5/6` : `w-5/6`
          } w-4/5 lg:w-1/5 mt-2 mb-8 text-center `}
        >
          <p className="leading-7 [&:not(:first-child)]:mt-6 ">
            {pageDetails?.bio}
          </p>
        </div>
      )}

      {links?.map((link) => (
        <LinkCard
          isEditable={false}
          link={link}
          key={link.id}
          isPreview={isPreview}
        />
      ))}

      {!isPreview && (
        <Link
          href="/"
          target="_blank"
          className=" bottom-2 flex m-2justify-center gap-2 mt-8"
        >
          <p>Get your own with </p>
          <LinkTapLogo className="text-center" />
        </Link>
      )}
    </div>
  );
}
