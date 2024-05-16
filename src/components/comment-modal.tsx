/* eslint-disable @next/next/no-img-element */

"use client";

import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { app } from "@/firebase";

import { isOpenState, postIdState } from "@/atoms/modal-atom";

import { PostInterface } from "@/libs/types";

import { HiX } from "react-icons/hi";

export function CommentModal() {
  const { data } = useSession();

  const router = useRouter();

  const [isOpen, setIsOpen] = useRecoilState(isOpenState);
  const [postId, setPostId] = useRecoilState(postIdState);

  const [post, setPost] = useState<PostInterface>({} as PostInterface);
  const [commentText, setCommentText] = useState("");
  const [isUploadingComment, setIsUploadingComment] = useState(false);

  const db = getFirestore(app);

  function handleCloseModal() {
    setIsOpen(!isOpen);
    setPostId("");
    setCommentText("");
    setPost({} as PostInterface);
  }

  function handleChangeCommentText(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setCommentText(event.target.value);
  }

  async function handleClickCommentPost() {
    setIsUploadingComment(true);

    const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
      uid: data?.user.uid,
      username: data?.user.username,
      name: data?.user.name,
      profileImage: data?.user.image,
      text: commentText,
      timestamp: serverTimestamp(),
    });

    setIsUploadingComment(false);
    setIsOpen(!isOpen);
    setCommentText("");
    setPost({} as PostInterface);

    router.push(`/posts/${postId}`);
  }

  useEffect(() => {
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
          setPost(snapshot.data() as PostInterface);
        } else {
          setPost({} as PostInterface);

          console.log("No such document!");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [db, postId]);

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
          className="max-w-lg w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md"
        >
          <div className="p-3">
            <div className="border-b border-gray-200 pb-3">
              <HiX
                onClick={handleCloseModal}
                className="h-8 w-8 p-2 text-red-400 rounded-full cursor-pointer hover:bg-red-100 transition-all duration-200"
              />
            </div>
            <div className="flex py-3 border-b border-gray-200">
              <img
                src={post.profileImage}
                alt={`Profile picture of ${post.name}`}
                className="h-11 w-11 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <h4 className="font-bold text-sm truncate">
                      {post.name} -
                    </h4>
                    <span className="text-xs truncate text-gray-500">
                      @{post.username}
                    </span>
                  </div>
                </div>
                <p className="text-sm mt-3">{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={`Image posted by ${post.name}`}
                    className="rounded-2xl mt-3"
                  />
                )}
              </div>
            </div>
            <div className="w-full border-b border-gray-200 py-3">
              <textarea
                onChange={handleChangeCommentText}
                value={commentText}
                rows={2}
                placeholder="Add a comment..."
                className="w-full border-none outline-none tracking-wide min-h-[50px] text-xs"
              />
            </div>
            <div className="flex items-center justify-end pt-3">
              <button
                disabled={commentText.length === 0 || isUploadingComment}
                className="bg-sky-400 text-white px-4 py-1.5 rounded-full font-semibold shadow-md hover:brightness-90 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                onClick={handleClickCommentPost}
              >
                Reply
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
