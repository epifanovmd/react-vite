import { AboutPage } from "./pages/about/AboutPage";
import { Login } from "./pages/login/Login";
import { Posts } from "./pages/posts/Posts";

export enum RoutePaths {
  ROOT = "/",
  AUTH = "/auth",
  ABOUT = "/about",
}

export interface IRoute<
  P extends string = RoutePaths,
  T extends string = string,
> {
  path: P;
  pathName: T;
  component: any;
  children?: IRoute<P>[];
  private?: boolean;
}

export const routes: IRoute[] = [
  {
    path: RoutePaths.ROOT,
    pathName: "posts",
    component: Posts,
    private: true,
  },
  {
    path: RoutePaths.AUTH,
    pathName: "auth",
    component: Login,
  },
  {
    path: RoutePaths.ABOUT,
    pathName: "about",
    component: AboutPage,
  },
];
