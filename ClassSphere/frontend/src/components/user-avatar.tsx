import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function UserAvatar() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Skeleton className={cn("h-9", "w-9", "rounded-full")} />;
  }

  const fullName = user.name;
  const avatar = user.image;

  return (
    <Avatar className={cn("h-9", "w-9")}>
      {avatar && <AvatarImage src={avatar} alt={fullName} />}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.trim().split(/\s+/);
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = "UserAvatar";
