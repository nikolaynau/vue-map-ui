import { describe, it, expect, vi } from 'vitest';
import { ref, reactive, h, defineComponent, onMounted, nextTick } from 'vue';
import { DivIcon } from 'leaflet';
import { mount } from '../../../../.test';
import { provideApi } from '../../../composables';
import { markerApiKey, useDivIcon } from '../composables';
import VMapPinIcon, { type Props } from '../VMapPinIcon.vue';

describe('VMapPinIcon', () => {
  it('should be expose instance', () => {
    expect.assertions(1);

    const Component = defineComponent({
      setup() {
        const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);

        onMounted(() => {
          expect(icon.value?.icon).toBeInstanceOf(DivIcon);
        });

        return () => h(VMapPinIcon, { ref: icon });
      }
    });

    mount(Component);
  });

  it('should be provide icon instance', () => {
    expect.assertions(1);

    const ChildComponent = defineComponent({
      setup() {
        const icon = useDivIcon();
        expect(icon?.value).toBeInstanceOf(DivIcon);
        return () => null;
      }
    });

    const Component = defineComponent({
      setup() {
        return () => h(VMapPinIcon, () => h(ChildComponent));
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
        return () => h(RootComponent, () => h(VMapPinIcon));
      }
    });

    const vm = mount(Component);
    vm.unmount();

    expect(markerApi.setIcon.mock.calls).toHaveLength(2);
    expect(markerApi.setIcon.mock.calls[0][0]).toBeInstanceOf(DivIcon);
    expect(markerApi.setIcon.mock.calls[1][0]).toBeNull();
  });

  it('should be render html', async () => {
    const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);

    const Component = defineComponent({
      setup() {
        return () => h(VMapPinIcon, { ref: icon });
      }
    });

    mount(Component);

    await nextTick();

    expect(icon.value?.icon?.options.html).toMatchSnapshot();
  });

  it('should be render html with default slot', async () => {
    const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapPinIcon, { ref: icon }, () => h('i', { class: 'icon' }));
      }
    });

    mount(Component);

    await nextTick();

    expect(icon.value?.icon?.options.html).toMatchSnapshot();
  });

  it('should work with color', async () => {
    const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);
    const props = reactive<Props>({
      color: '#fff'
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapPinIcon, { ref: icon, ...props }, () =>
            h('i', { class: 'icon' })
          );
      }
    });

    mount(Component);

    await nextTick();

    expect(icon.value?.icon?.options.html).toMatchSnapshot();
  });

  it('should work with background color', async () => {
    const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);
    const props = reactive<Props>({
      color: '#fff',
      backgroundColor: '#000'
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapPinIcon, { ref: icon, ...props }, () =>
            h('i', { class: 'icon' })
          );
      }
    });

    mount(Component);

    await nextTick();

    expect(icon.value?.icon?.options.html).toMatchSnapshot();
  });

  it('should work with placeholder color', async () => {
    const icon = ref<InstanceType<typeof VMapPinIcon> | null>(null);
    const props = reactive<Props>({
      placeholderColor: 'green'
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapPinIcon, { ref: icon, ...props }, () =>
            h('i', { class: 'icon' })
          );
      }
    });

    mount(Component);

    await nextTick();

    expect(icon.value?.icon?.options.html).toMatchSnapshot();
  });
});
