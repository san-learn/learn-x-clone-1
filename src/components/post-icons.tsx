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
import { useRecoilState } from "recoil";

import { app } from "@/firebase";

import { isOpenState, postIdState } from "@/atoms/modal-atom";

import {
  HiHeart,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
} from "react-icons/hi";

export function PostIcons({ id, uid }: { id: string; uid: string }) {
  const { data } = useSession();

  const [isOpen, setIsOpen] = useRecoilState(isOpenState);
  const [postId, setPostId] = useRecoilState(postIdState);

  const [likes, setLikes] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [isLiked, setIsLiked] = useState(false);

  const db = getFirestore(app);

  function handleClickOpenModal() {
    if (data) {
      setIsOpen(!isOpen);
      setPostId(id);
    } else {
      signIn();
    }
  }

  async function handleClickLikePost() {
    if (data) {
      await setDoc(doc(db, "posts", id, "likes", data.user.uid as string), {
        name: data.user.name,
        username: data.user.username,
        timestamp: serverTimestamp(),
      });
    } else {
      signIn();
    }
  }

  async function handleClickUnlikePost() {
    if (data) {
      await deleteDoc(doc(db, "posts", id, "likes", data.user.uid as string));
    } else {
      signIn();
    }
  }

  async function handleClickDeletePost() {
    const isConfirmed = confirm("Are you sure you want to delete this post?");

    if (isConfirmed) {
      if (data?.user.uid === uid) {
        await deleteDoc(doc(db, "posts", id));

        console.log("Post deleted successfully");

        window.location.reload();
      } else {
        signIn();
      }
    }
  }

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "comments"), (snapshot) => {
      setComments(snapshot.docs);
    });

    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db, id]);

  useEffect(() => {
    setIsLiked(likes.map((like) => like.id).includes(data?.user.uid as string));
  }, [data?.user.uid, likes]);

  return (
    <div className="flex items-center justify-start gap-2 mt-3">
      <HiOutlineChat
        onClick={handleClickOpenModal}
        className="h-8 w-8 p-2 text-sky-400 rounded-full cursor-pointer hover:bg-sky-100 transition-all duration-200"
      />
      {comments.length > 0 && (
        <span className="text-xs text-gray-500">{`${comments.length} ${
          comments.length > 1 ? "comments" : "comment"
        }`}</span>
      )}
      <div className="flex items-center justify-center gap-2 mr-auto">
        {isLiked ? (
          <HiHeart
            onClick={handleClickUnlikePost}
            className="h-8 w-8 p-2 text-rose-400 rounded-full cursor-pointer hover:bg-rose-100 transition-all duration-200"
          />
        ) : (
          <HiOutlineHeart
            onClick={handleClickLikePost}
            className="h-8 w-8 p-2 text-rose-400 rounded-full cursor-pointer hover:bg-rose-100 transition-all duration-200"
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
          onClick={handleClickDeletePost}
          className="h-8 w-8 p-2 text-red-400 rounded-full cursor-pointer hover:bg-red-100 transition-all duration-200"
        />
      )}
    </div>
  );
}
