import { usePostsDataStore } from "@store";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

export const PostsPage = observer(() => {
  const { models, onRefresh } = usePostsDataStore();

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Posts page</h1>
      {models.map(post => (
        <div key={post.data.id}>
          <div>{post.data.title}</div>
          <div>{post.data.body}</div>
        </div>
      ))}
    </div>
  );
});
