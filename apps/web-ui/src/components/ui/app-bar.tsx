"use client";

import logo from "../../../public/logo.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/shad-ui/button";
import { ImageUp } from "lucide-react";
import { BiLogoGithub } from "react-icons/bi";
import { GITHUB_URL } from "@/lib/constants";
import { useMemo } from "react";

export const AppBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const disableUploadBtn = useMemo(
    () => pathname.startsWith("/upload"),
    [pathname],
  );

  return (
    <nav
      className={`fixed top-0 z-20 w-full flex justify-between items-center px-4 h-[56px] backdrop-blur-md bg-background/18 border-1 border-b-neutral-900`}
    >
      <Image
        priority
        src={logo}
        alt="Open Whisperer"
        className="h-[28px] w-auto"
        draggable={false}
        unselectable="on"
        onClick={() => {
          if (pathname !== "/") {
            router.push("/");
          }
        }}
      />

      <div className="flex gap-2 items-center">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <Button size="icon" variant="ghost">
            <BiLogoGithub size={24} />
          </Button>
        </a>
        <Button
          variant="secondary"
          disabled={disableUploadBtn}
          onClick={() => router.push("/upload")}
        >
          <ImageUp /> Upload Video
        </Button>
      </div>
    </nav>
  );
};
