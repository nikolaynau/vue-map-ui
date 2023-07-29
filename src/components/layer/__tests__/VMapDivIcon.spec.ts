import { describe, it, expect, vi } from 'vitest';
import { ref, h, defineComponent, onMounted, nextTick } from 'vue';
import { DivIcon } from 'leaflet';
import { mount } from '../../../../.test';
import { provideApi } from '../../../composables';
import { markerApiKey, useDivIcon } from '../composables';
import VMapDivIcon from '../VMapDivIcon.vue';

describe('VMapDivIcon', () => {
  it('should be expose instance', () => {
    expect.assertions(1);

    const Component = defineComponent({
      setup() {
        const icon = ref<InstanceType<typeof VMapDivIcon> | null>(null);

        onMounted(() => {
          expect(icon.value?.icon).toBeInstanceOf(DivIcon);
        });

        return () => h(VMapDivIcon, { ref: icon });
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
        return () => h(VMapDivIcon, () => h(ChildComponent));
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
        return () => h(RootComponent, () => h(VMapDivIcon));
      }
    });

    const vm = mount(Component);
    vm.unmount();

    expect(markerApi.setIcon.mock.calls).toHaveLength(2);
    expect(markerApi.setIcon.mock.calls[0][0]).toBeInstanceOf(DivIcon);
    expect(markerApi.setIcon.mock.calls[1][0]).toBeNull();
  });

  it('should work with html', async () => {
    const rawHtml = '<div>foo</div>';
    const html = ref<string | undefined>(undefined);
    const icon = ref<InstanceType<typeof VMapDivIcon> | null>(null);

    const Component = defineComponent({
      setup() {
        return () => h(VMapDivIcon, { ref: icon, html: html.value });
      }
    });

    mount(Component);

    expect(icon.value?.icon).toBeInstanceOf(DivIcon);
    expect(icon.value?.icon?.options.html).toBe(false);

    html.value = rawHtml;
    await nextTick();

    expect(icon.value?.icon?.options.html).toBe(rawHtml);
  });

  it('should work with render mode as html', async () => {
    const icon = ref<InstanceType<typeof VMapDivIcon> | null>(null);
    const counter = ref(0);

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapDivIcon, { ref: icon, renderMode: 'html' }, () =>
            h('div', `foo${counter.value}`)
          );
      }
    });

    mount(Component);

    await nextTick();
    expect(icon.value?.icon?.options.html).toBe('<div>foo0</div>');

    counter.value++;
    await nextTick();
    expect(icon.value?.icon?.options.html).toBe('<div>foo1</div>');
  });

  it.each([['node'], ['portal']])(
    'should work with render mode as %o',
    async renderMode => {
      const icon = ref<InstanceType<typeof VMapDivIcon> | null>(null);
      const counter = ref(0);

      const Component = defineComponent({
        setup() {
          return () =>
            h(
              VMapDivIcon,
              {
                ref: icon,
                rootClass: 'foo-bar',
                renderMode: renderMode as 'portal' | 'node'
              },
              () => h('div', `foo${counter.value}`)
            );
        }
      });

      mount(Component);

      await nextTick();
      expect(icon.value?.icon?.options.html).toBeInstanceOf(HTMLElement);
      expect((icon.value?.icon?.options.html as HTMLElement).outerHTML).toBe(
        '<div class="foo-bar"><div>foo0</div></div>'
      );

      counter.value++;
      await nextTick();
      expect((icon.value?.icon?.options.html as HTMLElement).outerHTML).toBe(
        '<div class="foo-bar"><div>foo1</div></div>'
      );
    }
  );
});
