"use client";

import { CloudAlert } from "lucide-react";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/constants";

export interface ErrorCardProps {
  message?: string;
  showLink?: boolean;
  link?: string;
}

export const ErrorCard = ({
  message,
  showLink = true,
  link = GITHUB_URL,
}: ErrorCardProps) => {
  return (
    <div className="h-[50dvh] flex flex-col justify-center items-center rounded-xl bg-card text-card-foreground">
      <CloudAlert size={120} className="text-red-500" />
      <p className="max-w-xl text-2xl text-red-500 text-center">
        {message ||
          "There was a problem loading the uploaded media. Please try again later or open a github issue:"}
      </p>
      {showLink && (
        <Link
          className="hover:underline mt-2 text-lg"
          href={link}
          target="_blank"
        >
          {link}
        </Link>
      )}
    </div>
  );
};
