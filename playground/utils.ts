import { ucFirst } from '../src/utils/strings';

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
    const groupKey = parts[parts.length - 2];
    const titleKey = parts[parts.length - 1].slice(0, -4);
    const url = `/${groupKey}/${titleKey}`;

    const group = ucFirst(groupKey);
    const title = titleKey
      .split('-')
      .map(s => ucFirst(s))
      .join(' ');

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
