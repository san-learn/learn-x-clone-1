"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { app } from "@/firebase";

import { HiHeart, HiOutlineHeart, HiOutlineTrash } from "react-icons/hi";

export function CommentIcons({
  commentId,
  uid,
  postId,
}: {
  commentId: string;
  uid: string;
  postId: string;
}) {
  const { data } = useSession();

  const [likes, setLikes] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [isLiked, setIsLiked] = useState(false);

  const db = getFirestore(app);

  async function handleClickLikeComment() {
    if (data) {
      await setDoc(
        doc(
          db,
          "posts",
          postId,
          "comments",
          commentId,
          "likes",
          data.user.uid as string
        ),
        {
          name: data.user.name,
          username: data.user.username,
          timestamp: serverTimestamp(),
        }
      );
    } else {
      signIn();
    }
  }

  async function handleClickUnlikeComment() {
    if (data) {
      await deleteDoc(
        doc(
          db,
          "posts",
          postId,
          "comments",
          commentId,
          "likes",
          data.user.uid as string
        )
      );
    } else {
      signIn();
    }
  }

  async function handleClickDeleteComment() {
    const isConfirmed = confirm(
      "Are you sure you want to delete this comment?"
    );

    if (isConfirmed) {
      if (data?.user.uid === uid) {
        await deleteDoc(doc(db, "posts", postId, "comments", commentId));

        console.log("Comment deleted successfully");

        window.location.reload();
      } else {
        signIn();
      }
    }
  }

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments", commentId, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
  }, [commentId, db, postId]);

  useEffect(() => {
    setIsLiked(likes.map((like) => like.id).includes(data?.user.uid as string));
  }, [data?.user.uid, likes]);

  return (
    <div className="flex items-center justify-start gap-2 mt-3">
      <div className="flex items-center justify-center gap-2 mr-auto">
        {isLiked ? (
          <HiHeart
            onClick={handleClickUnlikeComment}
            className="h-7 w-7 p-2 text-rose-400 rounded-full cursor-pointer hover:bg-rose-100 transition-all duration-200"
          />
        ) : (
          <HiOutlineHeart
            onClick={handleClickLikeComment}
            className="h-7 w-7 p-2 text-rose-400 rounded-full cursor-pointer hover:bg-rose-100 transition-all duration-200"
          />
        )}
        {likes.length > 0 && (
          <span className="text-xs text-gray-500">{`${likes.length} ${
            likes.length > 1 ? "likes" : "like"
          }`}</span>
        )}
      </div>
      {data?.user.uid === uid && (
        <HiOutlineTrash
          onClick={handleClickDeleteComment}
          className="h-7 w-7 p-2 text-red-400 rounded-full cursor-pointer hover:bg-red-100 transition-all duration-200"
        />
      )}
    </div>
  );
}
