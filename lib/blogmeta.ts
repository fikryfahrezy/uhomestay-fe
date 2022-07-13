import type { EditorState, LexicalNode } from "lexical";

export type GetBlogMetaRet = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content_text: string;
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
  let contentText = "";

  entries.forEach((node) => {
    const nodeType = node.getType();

    let text = "";
    if (nodeType === "text") {
      text = (node as any)["__text"] as string;
      contentText += text + " ";
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
    title: title.slice(0, 50),
    short_desc: shortDesc.slice(0, 60),
    thumbnail_url: thumbnailUrl,
    content_text: contentText,
  };

  return ret;
};

export const getPlainText: (editorState: EditorState) => string = (
  editorState
) => {
  const entries: LexicalNode[] = [];
  editorState._nodeMap.forEach((v) => {
    entries.push(v);
  });

  let contentText = "";

  entries.forEach((node) => {
    const nodeType = node.getType();

    if (nodeType === "text") {
      contentText += ((node as any)["__text"] as string) + " ";
    }
  });

  return contentText;
};
