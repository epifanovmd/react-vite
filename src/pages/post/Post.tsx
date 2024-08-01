import { usePostDataStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

export const PostPage = observer(() => {
  const { postId } = useParams({ from: "/_private/post/$postId" });
  const { model, loading, onRefresh } = usePostDataStore();

  useEffect(() => {
    onRefresh(+postId).then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Post page</h1>
      <h3>{`${loading}`}</h3>
      <div key={model?.data?.id}>
        <div>{model?.data?.title}</div>
        <div>{model?.data?.body}</div>
      </div>
    </div>
  );
});
