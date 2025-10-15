import PostList from "@/components/post/post-list";
import { getAllPosts } from "@/lib/db/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - My Blog",
  description: "Welcome to my blog where I share my thoughts and ideas.",
};

export default async function Home() {
  const posts = await getAllPosts();
  const postsArray = Array.isArray(posts) ? posts : [];
  const errorMessage =
    !Array.isArray(posts) && typeof posts === "object" && "message" in posts
      ? (posts as { success: boolean; message: string }).message
      : null;

  return (
    <main className="py-10 ">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Welcome to the Blog</h1>
        {postsArray.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-medium">
              {errorMessage ?? "No posts available"}
            </h2>
          </div>
        ) : (
          <PostList posts={postsArray} />
        )}
      </div>
    </main>
  );
}
