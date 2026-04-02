declare module 'react' {
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
}

declare module 'react-router-dom' {
  export function useNavigate(): (to: string, options?: { state?: unknown }) => void;
}

declare module 'react/jsx-runtime' {
  export const Fragment: unknown;
  export const jsx: unknown;
  export const jsxs: unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
