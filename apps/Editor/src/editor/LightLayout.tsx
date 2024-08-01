import { Outlet, useLocation } from "react-router";
import React from "react";
import { Link } from "react-router-dom";

export default function LightEditorLayout() {
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
                to={"/" + [...splitedPath].splice(0, index + 1).join("/")}
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
      <Outlet />
    </div>
  );
}
