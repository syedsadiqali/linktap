import { LinkCard } from "@/components/link-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LinksRow, UsersRow } from "@/types/utils";
import Link from "next/link";
import LinkTapLogo from "./LinkTapLogo";

export default function PublicPage({
  userDetails,
  links,
  isPreview,
  avatarUrl,
  theme,
  className,
}: {
  userDetails: UsersRow;
  links: Partial<LinksRow>[];
  isPreview?: boolean;
  theme?: string;
  avatarUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center pt-16 w-full h-full ${className}`}
      data-theme={theme || "light"}
    >
      <Avatar variant={"xl"}>
        <AvatarImage src={avatarUrl as string} />
        <AvatarFallback>
          {getInitials(userDetails?.full_name as string)}
        </AvatarFallback>
      </Avatar>

      <div className="text-lg font-semibold">@{userDetails?.user_handle}</div>

      <div
        className={`${
          isPreview ? `lg:w-5/6` : `w-5/6`
        } w-4/5 lg:w-1/5 mt-2 mb-8 text-center `}
      >
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {userDetails?.bio}
        </p>
      </div>

      {links.map((link) => (
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
