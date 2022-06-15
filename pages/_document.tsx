/**
 * https://github.com/vercel/next.js/blob/canary/examples/with-portals-ssr/pages/_document.js
 */

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerPortal } from "@/lib/react-portal-universal/server";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const portals = new ServerPortal();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          portals.collectPortals(<App {...props} />),
      });

    const { html, ...props } = await Document.getInitialProps(ctx);

    const htmlWithPortals = portals.appendUniversalPortals(html);

    return {
      html: htmlWithPortals,
      ...props,
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
