import React from "react";

const Loading = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-slate-200"></div>
    </div>
  );
};

export default Loading;
