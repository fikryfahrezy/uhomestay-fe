/**
 * Copyright 2019 Jess Telford & Michal Zalecki
 *
 * Permission to use, copy, modify, and/or distribute this software for
 * any purpose with or without fee is hereby granted, provided that the
 * above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * https://github.com/jesstelford/react-portal-universal
 */

import type { ChildrenSelectorTuple } from "./PortalManager";
import { createPortal } from "react-dom";
import { PortalConsumer } from "./PortalManager";

function canUseDOM() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

function createUniversalPortal(
  children: (JSX.Element | null) | (JSX.Element | null)[],
  selector: string,
  portals: ChildrenSelectorTuple[]
) {
  if (!canUseDOM()) {
    portals.push([children, selector]); // yes, mutation (҂◡_◡)
    return null; // do not render anything on the server
  }

  // TODO: Do not cast to any when typings are updated for createPortal
  const container = document.querySelector(selector);
  if (container === undefined || container === null) {
    console.error("container undefined");
    return;
  }

  return createPortal(children, container);
}

export function prepareClientPortals() {
  if (canUseDOM()) {
    Array.prototype.slice
      .call(document.querySelectorAll("[data-react-universal-portal]"))
      .forEach(
        /**
         *
         * @param {Element} node
         */
        function (node) {
          node.remove();
        }
      );
  }
}

type UniversalPortalProps = {
  children: (JSX.Element | null) | (JSX.Element | null)[];
  selector: string;
};

export const UniversalPortal = ({
  children,
  selector,
}: UniversalPortalProps) => (
  <PortalConsumer>
    {(portals) => createUniversalPortal(children, selector, portals)}
  </PortalConsumer>
);
