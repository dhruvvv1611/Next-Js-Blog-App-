"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import UserMenu from "../auth/user-menu";
import ThemeToggle from "../theme/theme-toggle";

const Header = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <div className="border-b bg-background flex sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={"/"} className="text-2xl font-bold">
            Next Js
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg hover:text-primary transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block"></div>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {isPending ? null : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Button
                className="cursor-pointer"
                variant="default"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
