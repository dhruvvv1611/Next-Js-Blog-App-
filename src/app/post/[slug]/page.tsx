import { PostContent } from "@/components/post/post-content";
import { auth } from "@/lib/auth";
import { getPostById } from "@/lib/db/queries";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const PostDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const result = await getPostById(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthor = Boolean(session?.user && session.user.id === post.authorId);

  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto">
        <PostContent post={{ ...post, isAuthor }} />
      </div>
    </main>
  );
};

export default PostDetailPage;
