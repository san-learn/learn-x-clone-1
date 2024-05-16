"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { app } from "@/firebase";

import { CommentInterface } from "@/libs/types";

import { Comment } from "@/components/comment";

export function Comments({ postId }: { postId: string }) {
  const db = getFirestore(app);

  const [comments, setComments] = useState<CommentInterface[]>([]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as CommentInterface;
          })
        );
      }
    );
  }, [db, postId]);

  return (
    <>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} postId={postId} />
      ))}
    </>
  );
}
