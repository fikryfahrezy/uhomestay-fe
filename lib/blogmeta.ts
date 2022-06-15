import type { EditorState, LexicalNode } from "lexical";

export type GetBlogMetaRet = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
};

export const getBlogMeta: (editorState: EditorState) => GetBlogMetaRet = (
  editorState
) => {
  const entries: LexicalNode[] = [];
  editorState._nodeMap.forEach((v) => {
    entries.push(v);
  });

  let title = "";
  let shortDesc = "";
  let thumbnailUrl = "";

  entries.forEach((node, i) => {
    const nodeType = node.getType();

    let text = "";
    if (nodeType === "text") {
      text = (node as any)["__text"] as string;
    }

    if (title === "" && text !== "") {
      title = text;
      return;
    }

    if (shortDesc === "") {
      shortDesc = text;
    }

    if (nodeType === "image" && thumbnailUrl === "") {
      thumbnailUrl = (node as any)["__src"];
    }
  });

  const ret = {
    title,
    short_desc: shortDesc,
    thumbnail_url: thumbnailUrl,
  };

  return ret;
};
