export type UseSplitAttrsReturn<T = Record<string, unknown>> = {
  default: T;
} & Record<string, T>;

export function useSplitAttrs(prefixes: string[]): UseSplitAttrsReturn {
  return { default: {} };
}
