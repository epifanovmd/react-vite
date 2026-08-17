import { fieldVariants } from "../../../foundation/field-variants";
import { datePickerTriggerVariants } from "../date-picker-variants";

describe("datePickerTriggerVariants", () => {
  it("uses the native shared field appearance", () => {
    expect(datePickerTriggerVariants()).toContain(
      fieldVariants({ focusMode: "open" }),
    );
    expect(datePickerTriggerVariants()).toContain("cursor-pointer");
    expect(datePickerTriggerVariants({ size: "lg" })).toContain("h-12");
    expect(datePickerTriggerVariants({ variant: "error" })).toContain(
      "data-[state=open]:shadow-focus-error",
    );
  });
});
