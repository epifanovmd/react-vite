import { useAuthStore } from "@store";
import { FC, ReactNode } from "react";

import { Header } from "../header";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const auth = useAuthStore();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <Header onSignOut={() => auth.signOut()} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-muted/30">
        {children}
      </main>
    </div>
  );
};
