import { getRouteApi } from "@tanstack/react-router";

import { useCurrentSection } from "../model";
import { UiKitPager } from "./UiKitPager";
import { UiKitSectionHeader } from "./UiKitSectionHeader";
import { UiKitSectionNotFound } from "./UiKitSectionNotFound";

const sectionRoute = getRouteApi("/ui/$section");

/** Страница одного раздела: шапка, примеры и переход к соседним. */
export const UiKitSectionPage = () => {
  const { section: sectionId } = sectionRoute.useParams();
  const { section, groupLabel, previous, next } = useCurrentSection(sectionId);

  if (!section) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <UiKitSectionNotFound />
      </div>
    );
  }

  const { Component } = section;

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 lg:py-10">
      <UiKitSectionHeader section={section} groupLabel={groupLabel} />
      <Component />
      <UiKitPager previous={previous} next={next} />
    </article>
  );
};
