export type AddPrefix<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${Capitalize<K>}` : never]: T[K];
};
