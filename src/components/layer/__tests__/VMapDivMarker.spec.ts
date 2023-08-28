import { describe, it, expect } from 'vitest';
import { ref, reactive, h, defineComponent, onMounted, nextTick } from 'vue';
import { DivIcon, Marker } from 'leaflet';
import { mount } from '../../../../.test';
import VMapDivMarker from '../VMapDivMarker.vue';

describe('VMapDivMarker', () => {
  it('should be expose instances', () => {
    expect.assertions(2);

    const Component = defineComponent({
      setup() {
        const marker = ref<InstanceType<typeof VMapDivMarker> | null>(null);

        onMounted(() => {
          expect(marker.value?.icon).toBeInstanceOf(DivIcon);
          expect(marker.value?.marker).toBeInstanceOf(Marker);
        });

        return () => h(VMapDivMarker, { latlng: [0, 0], ref: marker });
      }
    });

    mount(Component);
  });

  it('should be reactive attrs', async () => {
    const props = reactive<any>({
      latlng: [0, 0],
      iconHtml: '<i class="icon">Foo</i>'
    });

    const marker = ref<InstanceType<typeof VMapDivMarker> | null>(null);

    const Component = defineComponent({
      setup() {
        return () => h(VMapDivMarker, { ref: marker, ...props });
      }
    });

    mount(Component);

    await nextTick();

    expect(marker.value?.marker?.getLatLng()).toEqual({ lat: 0, lng: 0 });
    expect(marker.value?.icon?.options.html).toMatchSnapshot('init html');

    props.latlng = [1, 2];
    props.iconHtml = '<i class="icon">Bar</i>';
    await nextTick();

    expect(marker.value?.marker?.getLatLng()).toEqual({ lat: 1, lng: 2 });
    expect(marker.value?.icon?.options.html).toMatchSnapshot('change html');
  });

  it('should be render default slot', async () => {
    const marker = ref<InstanceType<typeof VMapDivMarker> | null>(null);

    const Component = defineComponent({
      setup() {
        return () =>
          h(VMapDivMarker, { ref: marker, latlng: [0, 0] }, () =>
            h('i', { class: 'icon' })
          );
      }
    });

    mount(Component);

    await nextTick();
    expect(marker.value?.icon?.options.html).toMatchSnapshot();
  });
});
