import Link from "next/link";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { app } from "@/firebase";

import { PostInterface } from "@/libs/types";

import { Comments } from "@/components/comments";
import { Post } from "@/components/post";

import { HiOutlineArrowLeft } from "react-icons/hi";

export default async function PostsSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const db = getFirestore(app);
  const querySnapshotPost = await getDoc(doc(db, "posts", params.slug));
  const post = {
    ...querySnapshotPost.data(),
    id: querySnapshotPost.id,
  } as PostInterface;

  return (
    <div className="max-w-xl mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 p-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link
          href="/"
          className="text-red-400 p-2 rounded-full hover:bg-red-100 transition-all duration-200"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
        </Link>
      </div>
      <Post post={post} />
      <Comments postId={post.id} />
    </div>
  );
}
