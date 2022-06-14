/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { Suspense } from "react";
import styles from "./Styles.module.css";

type Cache = {
  img: string;
  title: string;
  domain: string;
  description: string;
};

const PREVIEW_CACHE: {
  [k: string]: { preview: Cache | null };
} = {};

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

function useSuspenseRequest(url: string) {
  let cached = PREVIEW_CACHE[url];

  if (!url.match(URL_MATCHER)) {
    return { preview: null };
  }

  if (!cached) {
    cached = PREVIEW_CACHE[url] = fetch(
      `/api/link-preview?url=${encodeURI(url)}`
    )
      .then((response) => response.json())
      .then((preview: { preview: Cache }) => {
        PREVIEW_CACHE[url] = preview;
        return preview;
      })
      .catch(() => {
        PREVIEW_CACHE[url] = { preview: null };
      }) as unknown as { preview: Cache };
  }

  if (cached instanceof Promise) {
    throw cached;
  }

  return cached;
}

type LinkPreviewContentProps = {
  url: string;
};

function LinkPreviewContent({ url }: LinkPreviewContentProps) {
  const { preview } = useSuspenseRequest(url);
  if (preview === null) {
    return null;
  }
  return (
    <div className={styles["LinkPreview__container"]}>
      {preview.img && (
        <div className={styles["LinkPreview__imageWrapper"]}>
          <img
            src={preview.img}
            alt={preview.title}
            className={styles["LinkPreview__image"]}
          />
        </div>
      )}
      {preview.domain && (
        <div className={styles["LinkPreview__domain"]}>{preview.domain}</div>
      )}
      {preview.title && (
        <div className={styles["LinkPreview__title"]}>{preview.title}</div>
      )}
      {preview.description && (
        <div className={styles["LinkPreview__description"]}>
          {preview.description}
        </div>
      )}
    </div>
  );
}

type GlimmerProps = JSX.IntrinsicElements["div"] & {
  index: number;
};

function Glimmer(props: GlimmerProps): JSX.Element {
  return (
    <div
      className={styles["LinkPreview__glimmer"]}
      {...props}
      style={{
        animationDelay: String((props.index || 0) * 300),
        ...(props.style || {}),
      }}
    />
  );
}

type LinkPreviewProps = Readonly<{
  url: string;
}>;

export default function LinkPreview({ url }: LinkPreviewProps) {
  return (
    <Suspense
      fallback={
        <>
          <Glimmer style={{ height: "80px" }} index={0} />
          <Glimmer style={{ width: "60%" }} index={1} />
          <Glimmer style={{ width: "80%" }} index={2} />
        </>
      }
    >
      <LinkPreviewContent url={url} />
    </Suspense>
  );
}
