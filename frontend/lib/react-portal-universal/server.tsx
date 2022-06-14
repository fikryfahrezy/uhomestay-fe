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
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { PortalManager } from "./PortalManager";

export class ServerPortal {
  portals: ChildrenSelectorTuple[];

  constructor() {
    this.portals = [];
    this.appendUniversalPortals = this.appendUniversalPortals.bind(this);
  }

  collectPortals(children: JSX.Element) {
    return <PortalManager portals={this.portals}>{children}</PortalManager>;
  }

  appendUniversalPortals(html: string) {
    if (!this.portals.length) {
      return html;
    }

    const $ = load(html);
    this.portals.forEach(([children, selector]) => {
      try {
        const markup = renderToStaticMarkup(children);
        // $(markup).attr("data-react-universal-portal", "").appendTo((selector as any))
        $(markup).attr("data-react-universal-portal", "").appendTo(selector);
      } catch (error) {
        console.warn(
          "Unable to render portal server-side:\n" + (error as Error).message ||
            (error as Error).toString().split("\n")[0]
        );
      }
    });

    // it's important to flush one and only one time per render
    this.portals.length = 0;

    return $.html({ decodeEntities: false });
  }
}
