"use client";

import Image from "next/image";
import profilePicPlaceholder from "../assets/profilePicPlaceholder.png";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface UserMenuButtonProps {
  session: Session | null;
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        {session ? (
          <Image
            src={user?.image || profilePicPlaceholder}
            alt="user profile icon"
            height={40}
            width={40}
            className="rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        )}
      </div>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="text-lg font-bold">
            Welcom {user ? user.name : "user"}!
          </span>
          <div className="card-actions">
            {user ? (
              <button
                className="btn btn-primary btn-block"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="btn btn-primary btn-block"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
