import { useMutation } from "react-query";
import useEditorStore from "./store/EditorStore";
import { Outlet, useLocation } from "react-router";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@repo/ui";

export default function EditorLayout({
  reloadData,
}: {
  reloadData: () => void;
}) {
  const { getEdtiorData, isEditorStale, removeStale } = useEditorStore(
    (state) => ({
      initData: state.initData,
      getEdtiorData: state.getEdtiorData,
      isEditorStale: state.isEditorStale,
      removeStale: state.removeStale,
    })
  );
  const mutation = useMutation({
    mutationFn: () =>
      fetch("http://localhost:3000/", {
        method: "POST",
        body: JSON.stringify(getEdtiorData()),
      }),
    onSuccess: () => removeStale(),
  });
  const location = useLocation();
  const splitedPath = location.pathname.split("/").filter((x) => x !== "");

  return (
    <div className="">
      <div className="w-full py-2 bg-slate-200 flex gap-4 items-center justify-center">
        <div className="flex">
          <Link className="text-xl hover:underline" to={"/"}>
            <span className="">editor</span>
            {splitedPath.length > 0 && <span className="text-lg px-2">/</span>}
          </Link>
          {splitedPath.map((path, index) => (
            <React.Fragment key={index}>
              <Link
                key={index}
                className="text-xl hover:underline"
                to={[...splitedPath].splice(0, index + 1).join("/")}
              >
                <span className="">{path}</span>
                {index !== splitedPath.length - 1 && (
                  <span className="text-lg px-2">/</span>
                )}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
      {isEditorStale && (
        <div className="fixed bg-slate-200 left-1/2 -translate-x-1/2 bottom-8 py-4 w-[800px] flex items-center gap-4 justify-center rounded-md z-10">
          <p>Modifications has not been saved</p>
          <Button
            action={() => mutation.mutate()}
            disabled={mutation.isLoading}
            rarity="epic"
          >
            Save
          </Button>
          <Button action={() => reloadData()} disabled={mutation.isLoading}>
            Reset state
          </Button>
        </div>
      )}
      <Outlet />
    </div>
  );
}
