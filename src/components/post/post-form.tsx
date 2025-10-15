"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPost, updatePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be at most 500 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  isEditing?: boolean;
  post?: {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
  };
}

export const PostForm = ({ isEditing, post }: PostFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues:
      isEditing && post
        ? {
            title: post.title,
            description: post.description,
            content: post.content,
          }
        : {
            title: "",
            description: "",
            content: "",
          },
  });

  const postSubmitHandler = async (values: PostFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("content", values.content);

      let res;

      if (isEditing && post) {
        res = await updatePost(post.id, formData);
      } else {
        res = await createPost(formData);
      }

      if (res?.success) {
        toast.success(isEditing ? "Post updated!" : "Post created!");
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(postSubmitHandler)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter post description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter post content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className=" cursor-pointer w-full"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating Post..."
            : isEditing
            ? "Update Post"
            : "Create Post"}
        </Button>
      </form>
    </Form>
  );
};
