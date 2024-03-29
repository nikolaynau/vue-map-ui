import { describe, it, expect, vi } from 'vitest';
import { ref, h, defineComponent, onMounted } from 'vue';
import { Icon } from 'leaflet';
import { mount } from '../../../../.test';
import { provideApi } from '../../../composables';
import { markerApiKey, useIcon } from '../composables';
import VMapDefaultIcon from '../VMapDefaultIcon.vue';

describe('VMapDefaultIcon', () => {
  it('should be expose instance', () => {
    expect.assertions(1);

    const Component = defineComponent({
      setup() {
        const icon = ref<InstanceType<typeof VMapDefaultIcon> | null>(null);

        onMounted(() => {
          expect(icon.value?.icon).toBeInstanceOf(Icon.Default);
        });

        return () => h(VMapDefaultIcon, { ref: icon });
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
        return () => h(VMapDefaultIcon, () => h(ChildComponent));
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
        return () => h(RootComponent, () => h(VMapDefaultIcon));
      }
    });

    const vm = mount(Component);
    vm.unmount();

    expect(markerApi.setIcon.mock.calls).toHaveLength(2);
    expect(markerApi.setIcon.mock.calls[0][0]).toBeInstanceOf(Icon);
    expect(markerApi.setIcon.mock.calls[1][0]).toBeNull();
  });
});
