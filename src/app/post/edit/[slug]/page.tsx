import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPostById } from "@/lib/db/queries";
import Container from "@/components/layout/conatainer";
import { PostForm } from "@/components/post/post-form";

const EditPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session) {
    redirect("/");
  }

  const post = await getPostById(slug);
  if (!post.success || !post.data) {
    notFound();
  }

  if (post.data.authorId !== session.user.id) {
    redirect("/");
  }

  return (
    <div>
      {" "}
      <h1 className="max-w-2xl font-bold text-3xl mb-6 mt-5">Edit Post</h1>
      <PostForm
        isEditing={true}
        post={{
          id: post.data.id,
          title: post.data.title,
          description: post.data.description,
          content: post.data.content,
          slug: post.data.slug,
        }}
      />
    </div>
  );
};

export default EditPost;
