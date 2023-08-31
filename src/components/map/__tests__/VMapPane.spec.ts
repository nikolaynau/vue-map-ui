import { describe, it, expect, beforeEach } from 'vitest';
import {
  h,
  defineComponent,
  ref,
  type Ref,
  markRaw,
  nextTick,
  reactive
} from 'vue';
import { Map } from 'leaflet';
import { mount } from '../../../../.test';
import { provideMap, usePane } from '../composables';
import VMapPane from '../VMapPane.vue';

describe('VMapPane', () => {
  let map: Map;

  beforeEach(() => {
    map = new Map(document.createElement('div'));
  });

  function wrap(
    map: Map,
    component: any,
    props?: object,
    children?: any,
    componentRef?: any
  ) {
    return defineComponent({
      setup() {
        provideMap(ref(markRaw(map)) as Ref<Map>);
        return { componentRef };
      },
      render() {
        return h(component, { ref: 'componentRef', ...props }, children);
      }
    });
  }

  it('should be expose pane element', async () => {
    const componentRef = ref<InstanceType<typeof VMapPane> | null>(null);
    mount(wrap(map, VMapPane, { name: 'paneA' }, undefined, componentRef));

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);
  });

  it('should be provide pane element', () => {
    expect.assertions(1);

    const Child = defineComponent({
      setup() {
        const pane = usePane()!;
        expect(pane.value).toBeInstanceOf(HTMLElement);
        return () => null;
      }
    });

    mount(
      wrap(
        map,
        VMapPane,
        { name: 'paneA' },
        {
          default: () => h(Child)
        }
      )
    );
  });

  it('should be init z-index', () => {
    const componentRef = ref<InstanceType<typeof VMapPane> | null>(null);
    mount(
      wrap(map, VMapPane, { name: 'paneA', zIndex: 1 }, undefined, componentRef)
    );

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);
    expect(componentRef.value?.paneElement?.style.zIndex).toBe('1');
  });

  it('change props', async () => {
    const props = reactive<{ name: string; zIndex: number | undefined }>({
      name: 'paneA',
      zIndex: undefined
    });
    const componentRef = ref<InstanceType<typeof VMapPane> | null>(null);
    mount(wrap(map, VMapPane, props, undefined, componentRef));

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);
    expect(componentRef.value?.paneElement?.className).toContain(
      'leaflet-paneA-pane'
    );
    expect(componentRef.value?.paneElement?.style.zIndex).toBe('');

    props.name = 'paneB';
    await nextTick();

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);
    expect(componentRef.value?.paneElement?.className).toContain(
      'leaflet-paneB-pane'
    );

    props.zIndex = 1;
    await nextTick();

    expect(componentRef.value?.paneElement?.style.zIndex).toBe('1');

    props.zIndex = undefined;
    await nextTick();

    expect(componentRef.value?.paneElement?.style.zIndex).toBe('auto');
  });

  it('init css class', () => {
    const componentRef = ref<InstanceType<typeof VMapPane> | null>(null);
    mount(
      wrap(
        map,
        VMapPane,
        { name: 'paneA', class: 'classA' },
        undefined,
        componentRef
      )
    );

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);
    expect(
      componentRef.value?.paneElement?.classList.contains('classA')
    ).toBeTruthy();
  });

  it('change css class', async () => {
    const props = reactive<{ name: string; class: any }>({
      name: 'paneA',
      class: undefined
    });
    const componentRef = ref<InstanceType<typeof VMapPane> | null>(null);
    mount(wrap(map, VMapPane, props, undefined, componentRef));

    expect(componentRef.value?.paneElement).toBeInstanceOf(HTMLElement);

    props.class = 'classA';
    await nextTick();

    expect(
      componentRef.value?.paneElement?.classList.contains('classA')
    ).toBeTruthy();

    props.class = ['classB', 'classC'];
    await nextTick();

    expect(
      componentRef.value?.paneElement?.classList.contains('classB')
    ).toBeTruthy();
    expect(
      componentRef.value?.paneElement?.classList.contains('classC')
    ).toBeTruthy();

    props.class = { classD: true, classE: false };
    await nextTick();

    expect(
      componentRef.value?.paneElement?.classList.contains('classD')
    ).toBeTruthy();

    props.class = undefined;
    await nextTick();

    expect(componentRef.value?.paneElement?.className).toBe(
      'leaflet-pane leaflet-paneA-pane'
    );
  });
});
