import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { usePostsDataStore } from "~@store";

export const PostsPage = observer(() => {
  const { models, onRefresh, onLoadMore } = usePostsDataStore();
  const ref = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnScroll = () => {
    if (
      ref.current &&
      window.scrollY + window.innerHeight >= ref.current.scrollHeight - 100
    ) {
      onLoadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <h1>Posts page</h1>
      {models.map(post => (
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            paddingBottom: "24px",
            cursor: "pointer",
          }}
          onClick={() => {
            post.data?.id &&
              navigate({
                to: "/post/$postId",
                params: { postId: String(post.data.id) },
              });
          }}
          key={post.data?.id}
        >
          <div
            style={{ paddingBottom: "5px", fontSize: 18, fontWeight: "bold" }}
          >
            {post.data?.title}
          </div>
          <div>{post.data?.body}</div>
        </div>
      ))}
    </div>
  );
});
