import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";

import { app } from "@/firebase";

import { PostInterface } from "@/libs/types";

import { Post } from "@/components/post";

export async function Feed() {
  const db = getFirestore(app);
  const getPostsQuery = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc")
  );
  const getPostsQuerySnapshot = await getDocs(getPostsQuery);

  const posts = getPostsQuerySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as PostInterface;
  });

  return (
    <>
      {posts &&
        posts.map((post, index) => {
          return <Post key={index} post={post} />;
        })}
    </>
  );
}
