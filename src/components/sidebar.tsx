/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { FaXTwitter } from "react-icons/fa6";
import { HiHome } from "react-icons/hi";

export function Sidebar() {
  const { data } = useSession();

  function handleClickSignIn() {
    signIn();
  }

  function handleClickSignOut() {
    signOut();
  }

  return (
    <div className="flex flex-col p-3 justify-between h-screen">
      <div className="flex flex-col gap-4 items-center xl:items-baseline">
        <Link href="/">
          <FaXTwitter className="w-16 h-16 p-3 hover:bg-gray-200 rounded-full transition-all duration-200" />
        </Link>
        <Link
          href="/"
          className="flex items-center p-3 hover:bg-gray-200 rounded-full transition-all duration-200 gap-2 w-fit"
        >
          <HiHome className="w-7 h-7" />
          <span className="hidden xl:inline font-bold">Home</span>
        </Link>
        {data ? (
          <button
            onClick={handleClickSignOut}
            className="bg-sky-400 text-white rounded-full hover:brightness-90 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline font-semibold"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleClickSignIn}
            className="bg-sky-400 text-white rounded-full hover:brightness-90 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline font-semibold"
          >
            Sign In
          </button>
        )}
      </div>
      {data && (
        <div className="text-sm flex items-center cursor-pointer p-3 hover:bg-gray-200 rounded-full transition-all duration-200">
          <img
            src={data.user.image as string}
            alt={`Profile picture of ${data.user.name}`}
            className="w-10 h-10 rounded-full xl:mr-2"
          />
          <div className="hidden xl:inline">
            <h4 className="font-bold">{data.user.name}</h4>
            <p className="text-gray-500">@{data.user.username}</p>
          </div>
        </div>
      )}
    </div>
  );
}
