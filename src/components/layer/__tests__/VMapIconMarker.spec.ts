import { describe, it, expect } from 'vitest';
import { ref, reactive, h, defineComponent, onMounted, nextTick } from 'vue';
import { Icon, Marker } from 'leaflet';
import { mount } from '../../../../.test';
import { useIcon, useMarker } from '../composables';
import VMapIconMarker, { type Attrs } from '../VMapIconMarker.vue';

describe('VMapIconMarker', () => {
  it('should be expose instances', () => {
    expect.assertions(2);

    const Component = defineComponent({
      setup() {
        const marker = ref<InstanceType<typeof VMapIconMarker> | null>(null);

        onMounted(() => {
          expect(marker.value?.icon).toBeInstanceOf(Icon);
          expect(marker.value?.marker).toBeInstanceOf(Marker);
        });

        return () =>
          h(VMapIconMarker, {
            ...({ latlng: [0, 0], iconIconUrl: 'foo.png' } as Attrs),
            ref: marker
          });
      }
    });

    mount(Component);
  });

  it('should be reactive attrs', async () => {
    const props = reactive<Attrs>({
      latlng: [0, 0],
      iconIconUrl: 'http://localhost/foo.png'
    });

    const marker = ref<InstanceType<typeof VMapIconMarker> | null>(null);

    const Component = defineComponent({
      setup() {
        return () => h(VMapIconMarker, { ref: marker, ...props });
      }
    });

    mount(Component);

    await nextTick();

    expect(marker.value?.marker?.getLatLng()).toEqual({ lat: 0, lng: 0 });
    expect(marker.value?.icon?.options.iconUrl).toBe(
      'http://localhost/foo.png'
    );

    props.latlng = [1, 2];
    props.iconIconUrl = 'http://localhost/bar.png';
    await nextTick();

    expect(marker.value?.marker?.getLatLng()).toEqual({ lat: 1, lng: 2 });
    expect(marker.value?.icon?.options.iconUrl).toBe(
      'http://localhost/bar.png'
    );
  });

  it('should be render default slot and provide marker and icon', async () => {
    const marker = ref<InstanceType<typeof VMapIconMarker> | null>(null);

    const Child = defineComponent({
      setup() {
        const marker = useMarker();
        const icon = useIcon();
        expect(marker?.value).toBeInstanceOf(Marker);
        expect(icon?.value).toBeInstanceOf(Icon);
        return () => null;
      }
    });

    const Component = defineComponent({
      setup() {
        return () =>
          h(
            VMapIconMarker,
            {
              ref: marker,
              latlng: [0, 0],
              iconIconUrl: 'http://localhost/foo.png'
            },
            () => h(Child)
          );
      }
    });

    mount(Component);
  });
});
