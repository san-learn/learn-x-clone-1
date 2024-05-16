/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { PostInterface } from "@/libs/types";

import { PostIcons } from "@/components/post-icons";

export function Post({ post }: { post: PostInterface }) {
  return (
    <div className="flex p-3 border-b border-gray-200 hover:bg-gray-100 transition-all duration-200">
      <img
        src={post.profileImage}
        alt={`Profile picture of ${post.name}`}
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-sm truncate">{post.name} -</h4>
            <span className="text-xs truncate text-gray-500">
              @{post.username}
            </span>
          </div>
        </div>
        <Link href={`/posts/${post.id}`}>
          <p className="text-sm my-3">{post.text}</p>
        </Link>
        {post.image && (
          <Link href={`/posts/${post.id}`}>
            <img
              src={post.image}
              alt={`Image posted by ${post.name}`}
              className="rounded-2xl"
            />
          </Link>
        )}
        <PostIcons id={post.id} uid={post.uid} />
      </div>
    </div>
  );
}
