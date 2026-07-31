import * as React from "react";

import type { DropdownPlacementProps } from "../types";

/** Выбирает из пропсов набор позиционирования для `SelectDropdown`. */
export const useDropdownPlacement = (
  props: DropdownPlacementProps,
): DropdownPlacementProps => {
  const {
    dropdownSide,
    dropdownAlign,
    dropdownSideOffset,
    dropdownAlignOffset,
    dropdownAvoidCollisions,
    dropdownCollisionPadding,
    dropdownWidth,
    dropdownMaxWidth,
    dropdownContainer,
  } = props;

  return React.useMemo(
    () => ({
      dropdownSide,
      dropdownAlign,
      dropdownSideOffset,
      dropdownAlignOffset,
      dropdownAvoidCollisions,
      dropdownCollisionPadding,
      dropdownWidth,
      dropdownMaxWidth,
      dropdownContainer,
    }),
    [
      dropdownSide,
      dropdownAlign,
      dropdownSideOffset,
      dropdownAlignOffset,
      dropdownAvoidCollisions,
      dropdownCollisionPadding,
      dropdownWidth,
      dropdownMaxWidth,
      dropdownContainer,
    ],
  );
};
