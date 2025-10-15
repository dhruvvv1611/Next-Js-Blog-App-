import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { posts } from "./schema";

export async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
      with: {
        author: true,
      },
    });

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      message: "An error occurred while fetching posts",
    };
  }
}

export async function getPostById(slug: string) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        author: true, // includes author relation if you defined one
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("❌ Error fetching post by slug:", error);
    return {
      success: false,
      message: "An error occurred while fetching the post.",
    };
  }
}
