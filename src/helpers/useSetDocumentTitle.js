import { useEffect } from "react";

export const useSetDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, []);
};
