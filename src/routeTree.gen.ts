/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/auth'
import { Route as PublicImport } from './routes/_public'
import { Route as PrivateImport } from './routes/_private'
import { Route as PrivateIndexImport } from './routes/_private/index'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as PrivatePostPostIdImport } from './routes/_private/post/$postId'

// Create/Update Routes

const AuthRoute = AuthImport.update({
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const PrivateRoute = PrivateImport.update({
  id: '/_private',
  getParentRoute: () => rootRoute,
} as any)

const PrivateIndexRoute = PrivateIndexImport.update({
  path: '/',
  getParentRoute: () => PrivateRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any)

const PrivatePostPostIdRoute = PrivatePostPostIdImport.update({
  path: '/post/$postId',
  getParentRoute: () => PrivateRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_private': {
      id: '/_private'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PrivateImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/_private/': {
      id: '/_private/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PrivateIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_private/post/$postId': {
      id: '/_private/post/$postId'
      path: '/post/$postId'
      fullPath: '/post/$postId'
      preLoaderRoute: typeof PrivatePostPostIdImport
      parentRoute: typeof PrivateImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  PrivateRoute: PrivateRoute.addChildren({
    PrivateIndexRoute,
    PrivatePostPostIdRoute,
  }),
  AuthRoute: AuthRoute.addChildren({ AuthLoginRoute }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_private",
        "/_public",
        "/auth"
      ]
    },
    "/_private": {
      "filePath": "_private.tsx",
      "children": [
        "/_private/",
        "/_private/post/$postId"
      ]
    },
    "/_public": {
      "filePath": "_public.tsx"
    },
    "/auth": {
      "filePath": "auth.tsx",
      "children": [
        "/auth/login"
      ]
    },
    "/auth/login": {
      "filePath": "auth/login.tsx",
      "parent": "/auth"
    },
    "/_private/": {
      "filePath": "_private/index.tsx",
      "parent": "/_private"
    },
    "/_private/post/$postId": {
      "filePath": "_private/post/$postId.tsx",
      "parent": "/_private"
    }
  }
}
ROUTE_MANIFEST_END */
