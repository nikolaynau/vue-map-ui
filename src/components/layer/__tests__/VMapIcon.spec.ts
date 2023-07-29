import { describe, it, expect, vi } from 'vitest';
import {
  ref,
  h,
  nextTick,
  defineComponent,
  onMounted,
  reactive,
  watch
} from 'vue';
import { Icon } from 'leaflet';
import { mount } from '../../../../.test';
import { provideApi } from '../../../composables';
import { markerApiKey, useIcon } from '../composables';
import VMapIcon, { type Props } from '../VMapIcon.vue';

describe('VMapIcon', () => {
  it('should be expose instance', () => {
    expect.assertions(1);

    const Component = defineComponent({
      setup() {
        const icon = ref<InstanceType<typeof VMapIcon> | null>(null);

        onMounted(() => {
          expect(icon.value?.icon).toBeInstanceOf(Icon);
        });

        return () => h(VMapIcon, { ref: icon, iconUrl: 'foo.png' });
      }
    });

    mount(Component);
  });

  it('should be provide icon instance', () => {
    expect.assertions(1);

    const ChildComponent = defineComponent({
      setup() {
        const icon = useIcon();
        expect(icon?.value).toBeInstanceOf(Icon);
        return () => null;
      }
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapIcon, { iconUrl: 'foo.png' }, () => h(ChildComponent));
      }
    });

    mount(Component);
  });

  it('should be use marker api for set icon', () => {
    const markerApi = {
      setIcon: vi.fn()
    };

    const RootComponent = defineComponent({
      setup(props, { slots }) {
        provideApi(markerApiKey, markerApi);
        return () => h('div', undefined, slots);
      }
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(RootComponent, () => h(VMapIcon, { iconUrl: 'foo.png' }));
      }
    });

    const vm = mount(Component);
    vm.unmount();

    expect(markerApi.setIcon.mock.calls).toHaveLength(2);
    expect(markerApi.setIcon.mock.calls[0][0]).toBeInstanceOf(Icon);
    expect(markerApi.setIcon.mock.calls[1][0]).toBeNull();
  });

  it('should be lazy create icon when not set icon url', async () => {
    const markerApi = {
      setIcon: vi.fn()
    };

    const props = reactive<Props>({
      iconUrl: undefined
    });

    const RootComponent = defineComponent({
      setup(props, { slots }) {
        provideApi(markerApiKey, markerApi);
        return () => h('div', undefined, slots);
      }
    });

    const Component = defineComponent({
      setup() {
        return () => h(RootComponent, () => h(VMapIcon, props));
      }
    });

    mount(Component);
    expect(markerApi.setIcon.mock.calls).toHaveLength(1);
    expect(markerApi.setIcon.mock.calls[0][0]).toBeNull();

    props.iconUrl = 'foo.png';
    await nextTick();

    expect(markerApi.setIcon.mock.calls).toHaveLength(2);
    expect(markerApi.setIcon.mock.calls[1][0]).toBeInstanceOf(Icon);
  });

  it('should be work when change props', async () => {
    const iconUrl = 'http://localhost/foo.png';

    let instance: Icon | null | undefined = null;

    const props = reactive<Props>({
      iconUrl: undefined,
      iconSize: undefined,
      iconAnchor: undefined,
      class: undefined,
      className: undefined
    });

    const Component = defineComponent({
      setup() {
        const icon = ref<InstanceType<typeof VMapIcon> | null>(null);

        watch(
          () => icon.value?.icon,
          val => {
            instance = val as Icon;
          }
        );

        return () => h(VMapIcon, { ref: icon, ...props });
      }
    });

    mount(Component);

    expect(instance).toBeNull();

    props.iconUrl = iconUrl;
    await nextTick();

    instance = instance as unknown as Icon;
    expect(instance).toBeInstanceOf(Icon);
    expect(instance.options.iconUrl).toBe(iconUrl);
    expect(instance.options.iconSize).toBe(undefined);
    expect(instance.options.iconAnchor).toBe(undefined);
    expect(instance.options.className).toBe(undefined);

    const img = instance.createIcon() as HTMLImageElement;
    expect(img.src).toBe(iconUrl);
    expect([...img.classList]).toEqual(['leaflet-marker-icon']);
    expect(img.style.height).toBe('');
    expect(img.style.width).toBe('');
    expect(img.style.marginLeft).toBe('');
    expect(img.style.marginTop).toBe('');

    props.iconSize = [10, 15];
    props.iconAnchor = [20, 25];
    props.class = ['a', 'b'];
    props.className = { c: true, b: false };
    await nextTick();

    expect(instance.options.iconSize).toEqual([10, 15]);
    expect(instance.options.iconAnchor).toEqual([20, 25]);
    expect(instance.options.className).toBe('a b c');

    expect([...img.classList]).toEqual(['leaflet-marker-icon', 'a', 'b', 'c']);
    expect(img.style.height).toBe('15px');
    expect(img.style.width).toBe('10px');
    expect(img.style.marginLeft).toBe('-20px');
    expect(img.style.marginTop).toBe('-25px');
  });
});
