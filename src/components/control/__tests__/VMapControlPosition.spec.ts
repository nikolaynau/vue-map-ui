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
import { provideMap } from '../../map';
import { useControlPosition } from '../composables';
import VMapControlPosition from '../VMapControlPosition.vue';

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

  it('should be expose position element', async () => {
    const componentRef = ref<InstanceType<typeof VMapControlPosition> | null>(
      null
    );
    mount(
      wrap(
        map,
        VMapControlPosition,
        { position: ['a', 'b'] },
        undefined,
        componentRef
      )
    );

    expect(componentRef.value?.positionElement).toBeInstanceOf(HTMLElement);
    expect(componentRef.value?.positionElement?.className).toBe(
      'leaflet-a leaflet-b'
    );
  });

  it('should be provide position element', () => {
    expect.assertions(1);

    const Child = defineComponent({
      setup() {
        const positionElement = useControlPosition()!;
        expect(positionElement.value).toBeInstanceOf(HTMLElement);
        return () => null;
      }
    });

    mount(
      wrap(
        map,
        VMapControlPosition,
        { position: ['a', 'b'] },
        {
          default: () => h(Child)
        }
      )
    );
  });

  it('should work when change position', async () => {
    const props = reactive<{ position: [string, string] | null }>({
      position: null
    });
    const componentRef = ref<InstanceType<typeof VMapControlPosition> | null>(
      null
    );
    mount(wrap(map, VMapControlPosition, props, undefined, componentRef));
    expect(componentRef.value?.positionElement).toBeNull();

    props.position = ['a', 'b'];
    await nextTick();

    expect(componentRef.value?.positionElement).toBeInstanceOf(HTMLElement);
    expect(componentRef.value?.positionElement?.className).toContain(
      'leaflet-a leaflet-b'
    );

    props.position = ['c', 'd'];
    await nextTick();

    expect(componentRef.value?.positionElement?.className).toContain(
      'leaflet-c leaflet-d'
    );

    props.position = null;
    await nextTick();

    expect(componentRef.value?.positionElement).toBeNull();
  });

  it('init css class', () => {
    const componentRef = ref<InstanceType<typeof VMapControlPosition> | null>(
      null
    );
    mount(
      wrap(
        map,
        VMapControlPosition,
        { position: ['a', 'b'], class: 'classA' },
        undefined,
        componentRef
      )
    );

    expect(componentRef.value?.positionElement).toBeInstanceOf(HTMLElement);
    expect(
      componentRef.value?.positionElement?.classList.contains('classA')
    ).toBeTruthy();
  });

  it('change css class', async () => {
    const props = reactive<{ position: [string, string]; class: any }>({
      position: ['a', 'b'],
      class: undefined
    });
    const componentRef = ref<InstanceType<typeof VMapControlPosition> | null>(
      null
    );
    mount(wrap(map, VMapControlPosition, props, undefined, componentRef));

    expect(componentRef.value?.positionElement).toBeInstanceOf(HTMLElement);

    props.class = 'classA';
    await nextTick();

    expect(
      componentRef.value?.positionElement?.classList.contains('classA')
    ).toBeTruthy();

    props.class = ['classB', 'classC'];
    await nextTick();

    expect(
      componentRef.value?.positionElement?.classList.contains('classB')
    ).toBeTruthy();
    expect(
      componentRef.value?.positionElement?.classList.contains('classC')
    ).toBeTruthy();

    props.class = { classD: true, classE: false };
    await nextTick();

    expect(
      componentRef.value?.positionElement?.classList.contains('classD')
    ).toBeTruthy();

    props.class = undefined;
    await nextTick();

    expect(componentRef.value?.positionElement?.className).toBe(
      'leaflet-a leaflet-b'
    );
  });
});
