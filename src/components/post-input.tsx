/* eslint-disable @next/next/no-img-element */

"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

import { app } from "@/firebase";

import { HiOutlinePhotograph } from "react-icons/hi";

export function PostInput({
  emailAllowedToPost,
}: {
  emailAllowedToPost: string[];
}) {
  const { data } = useSession();

  const db = getFirestore(app);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [postText, setPostText] = useState("");
  const [isUploadingPost, setIsUploadingPost] = useState(false);

  const imagePickerRef = useRef<HTMLInputElement>(null);

  function handleChangePostText(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setPostText(event.target.value);
  }

  function handleClickImagePicker() {
    imagePickerRef.current?.click();
  }

  function handleChangeAddImageToPost(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    let file;

    if (event.target.files) {
      file = event.target.files[0];
    }

    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  async function handleClickUploadPost() {
    setIsUploadingPost(true);

    const docRef = await addDoc(collection(db, "posts"), {
      uid: data?.user?.uid,
      name: data?.user?.name,
      username: data?.user?.username,
      profileImage: data?.user?.image,
      text: postText,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });

    setIsUploadingPost(false);
    setPostText("");
    setImageFileUrl("");
    setSelectedFile(undefined);

    location.reload();
  }

  const uploadImage = useCallback(() => {
    setIsUploadingImage(true);

    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${selectedFile?.name}`;
    const storageRef = ref(storage, `posts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile as Blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);

        setIsUploadingImage(false);
        setSelectedFile(undefined);
        setImageFileUrl("");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploadingImage(false);
          setImageFileUrl(downloadURL);
        });
      }
    );
  }, [selectedFile, setIsUploadingImage, setSelectedFile, setImageFileUrl]);

  useEffect(() => {
    if (selectedFile) {
      uploadImage();
    }
  }, [selectedFile, uploadImage]);

  if (!data || !emailAllowedToPost.includes(data.user?.email as string)) {
    return null;
  }

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <div className="w-full divide-y">
        <textarea
          onChange={handleChangePostText}
          value={postText}
          rows={2}
          placeholder="How's it going?"
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-sm"
        />
        {selectedFile && imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="Uploaded image"
            className={`w-full object-cover cursor-pointer ${
              isUploadingImage && "opacity-50 blur-sm"
            }`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={handleClickImagePicker}
            className="h-10 w-10 p-2 text-sky-400 rounded-full cursor-pointer hover:bg-sky-100 transition-all duration-200"
          />
          <input
            type="file"
            hidden
            ref={imagePickerRef}
            accept="image/*"
            onChange={handleChangeAddImageToPost}
          />
          <button
            disabled={
              postText.length === 0 || isUploadingImage || isUploadingPost
            }
            className="bg-sky-400 text-white px-4 py-1.5 rounded-full font-semibold shadow-md hover:brightness-90 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            onClick={handleClickUploadPost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
