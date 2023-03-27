export interface DemoEntry {
  title: string;
  url: string;
  component: Function;
}

export type DemoGroups = Record<string, DemoEntry[]>;

export function getDemoList(): DemoGroups {
  const result: DemoGroups = {};
  const list = import.meta.glob('./demo/*/*.vue');

  for (const [fileName, component] of Object.entries(list)) {
    const parts = fileName.split('/');
    const group = parts[parts.length - 2];
    const title = parts[parts.length - 1].slice(0, -4);
    const url = `/${group}/${title}`;

    if (!result[group]) {
      result[group] = [];
    }

    result[group].push({
      title,
      url,
      component
    });
  }

  return result;
}
