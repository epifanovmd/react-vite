import type { UISectionNeighbours } from "../model";
import { UiKitPagerLink } from "./UiKitPagerLink";

/** Навигация «назад / далее» внизу раздела, как в документации UI-китов. */
export const UiKitPager = ({ previous, next }: UISectionNeighbours) => (
  <nav
    aria-label="Соседние разделы"
    className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2"
  >
    <div>
      {previous && <UiKitPagerLink section={previous} direction="previous" />}
    </div>
    <div>{next && <UiKitPagerLink section={next} direction="next" />}</div>
  </nav>
);
