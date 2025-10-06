"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold py-4 block">
            <Image src="/oxyra.svg" alt="Oxyra Logo" width={120} height={40} />
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {" "}
                <Button variant="secondary">
                  <Bell />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{user.email}</p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="cursor-pointer">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/signup" className="px-3 py-2 ">
                    Register
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
