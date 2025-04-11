import { FC, memo, PropsWithChildren } from "react";

export const Container: FC<PropsWithChildren> = memo(({ children }) => (
  <div
    className="mx-auto px-4
      sm:max-w-[540px]
      md:max-w-[720px]
      lg:max-w-[940px]
      xl:max-w-[1140px]"
  >
    {children}
  </div>
));
