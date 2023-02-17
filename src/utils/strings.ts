export function ucFirst(str: string): string {
  return !str ? str : str[0].toUpperCase() + str.slice(1);
}

export function lcFirst(str: string): string {
  return !str ? str : str[0].toLowerCase() + str.slice(1);
}

export function isEmpty(str: string): boolean {
  return !str?.length;
}
