"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deletePost } from "@/actions/post-actions";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: number;
}

const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();

  const deletePostHandler = () => async () => {
    try {
      const res = await deletePost(postId);
      if (res.success) {
        toast.success("Post deleted successfully");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete the post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    }
  };

  return (
    <div>
      <Button
        className="cursor-pointer"
        variant={"destructive"}
        size={"sm"}
        onClick={deletePostHandler()}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete Post
      </Button>
    </div>
  );
};

export default DeletePostButton;
