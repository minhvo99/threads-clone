/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useContext } from "react";

const ModelContext = createContext();

export const useModelContext = () => {
  return useContext(ModelContext);
};

const ModelProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [content, setContent] = useState();

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isShowing]);
  const openPopup = (content) => {
    setIsShowing(true);
    setContent(content);
  };
  return (
    <ModelContext.Provider value={{ openPopup }}>
      {children}
      {isShowing && (
        <div
          className="fixed inset-0 bg-slate-600/60"
          onClick={() => setIsShowing(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white">{content}</p>
          </div>
        </div>
      )}
    </ModelContext.Provider>
  );
};

export default ModelProvider;
