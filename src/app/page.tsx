import { Feed } from "@/components/feed";
import { PostInput } from "@/components/post-input";

export default function RootPage() {
  const emailAllowedToPost = [process.env.EMAIL_1_ALLOWED_TO_POST as string];

  return (
    <div className="max-w-xl mx-auto border-l border-r min-h-screen">
      <div className="p-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
      </div>
      <PostInput emailAllowedToPost={emailAllowedToPost} />
      <Feed />
    </div>
  );
}
