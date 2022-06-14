/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styles from "./Input.module.css";

type TextInputType = Readonly<{
  "data-test-id"?: string;
  label: string;
  onChange: (v: string) => void;
  placeholder?: string;
  value: string;
}>;

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  "data-test-id": dataTestId,
}: TextInputType) {
  return (
    <div className={styles["Input__wrapper"]}>
      <label className={styles["Input__label"]}>{label}</label>
      <input
        type="text"
        className={styles["Input__input"]}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        data-test-id={dataTestId}
      />
    </div>
  );
}
