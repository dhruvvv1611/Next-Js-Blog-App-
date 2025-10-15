import { PostContentProps } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import DeletePostButton from "./delete-post-button";

export const PostContent = ({ post }: PostContentProps) => {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <CardDescription>
          By {post?.author?.name ?? "Unknown Author"} -{" "}
          {new Date(post.createdAt).toDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-lg mb-6">{post.description}</p>
        <p className="text-xl dark:text-gray-200  leading-relaxed">
          {post.content}
        </p>
      </CardContent>

      {post.isAuthor && (
        <CardFooter>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/post/edit/${post.slug}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Post
              </Link>
            </Button>
            <DeletePostButton postId={post.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
