"use client";
import { ModeToggle } from "@/components/common/ModeToggleTheme";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Info, LogOut, LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const onClick = () => {
    if (session?.user?.id) {
      signOut();
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="z-10 bg-background fixed top-0 left-0 right-0 z-10 w-full py-5 mx-auto container flex items-center justify-between">
      <div className="font-semibold text-2xl">SellSpot</div>
      <nav>
        <ul className="flex items-center justify-center gap-18">
          <li>
            <Link href="/page1">Home</Link>
          </li>
          <li>
            <Link href="/page2">Feature</Link>
          </li>
          <li>
            <Link href="/page2">FAQS</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        <ModeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer transition-transform hover:scale-105">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-2">
            <div className="flex flex-col space-y-1">
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer text-left">
                {/* <Settings className="h-4 w-4 text-muted-foreground" /> */}
                {session?.user?.name}
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer text-left">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Cài đặt
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer text-left">
                <Info className="h-4 w-4 text-muted-foreground" />
                Giới thiệu
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={onClick}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer text-left ${
                  session?.user?.id
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700"
                    : "text-primary dark:text-primary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {session?.user?.id ? (
                  <LogOut className="h-4 w-4" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {session?.user?.id ? "Đăng xuất" : "Đăng nhập"}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
