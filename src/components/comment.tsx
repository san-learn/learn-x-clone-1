/* eslint-disable @next/next/no-img-element */

import { CommentInterface } from "@/libs/types";
import { CommentIcons } from "./comment-icons";

export function Comment({
  comment,
  postId,
}: {
  comment: CommentInterface;
  postId: string;
}) {
  return (
    <div className="flex p-3 border-b border-gray-200 hover:bg-gray-100 transition-all duration-200">
      <img
        src={comment.profileImage}
        alt={`Profile picture of ${comment.name}`}
        className="h-9 w-9 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-xs truncate">{comment.name} -</h4>
            <span className="text-xs truncate text-gray-500">
              @{comment.username}
            </span>
          </div>
        </div>
        <p className="text-xs">{comment.text}</p>
        <CommentIcons
          commentId={comment.id}
          uid={comment.uid}
          postId={postId}
        />
      </div>
    </div>
  );
}
