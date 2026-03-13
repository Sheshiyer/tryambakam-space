import * as React from "react";
import { MobileProvider } from "../use-mobile";

const LazyInfiniteCanvasScene = React.lazy(() => import("./scene").then((mod) => ({ default: mod.InfiniteCanvasScene })));

export function InfiniteCanvas(props: React.ComponentProps<typeof LazyInfiniteCanvasScene>) {
  return (
    <MobileProvider>
      <React.Suspense fallback={null}>
        <LazyInfiniteCanvasScene {...props} />
      </React.Suspense>
    </MobileProvider>
  );
}
