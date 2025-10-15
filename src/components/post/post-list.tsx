import { PostListProps } from "@/lib/types";
import React from "react";
import Postcard from "./post-card";

const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((posts) => (
        <Postcard key={posts.id} post={posts} />
      ))}
    </div>
  );
};

export default PostList;
