import { describe, it, expect, beforeEach } from 'vitest';
import { ref, unref, h, nextTick, defineComponent, type Ref } from 'vue';
import { type LatLngExpression, Marker } from 'leaflet';
import { mount } from '../../../../.test';
import { VMap } from '../../map';
import VMapMarker from '../VMapMarker.vue';

describe('VMapMarker', () => {
  let latlng: LatLngExpression;

  beforeEach(() => {
    latlng = [1, 2];
  });

  function wrapComponent(
    defaultSlotFn: () => any,
    refs?: Record<string, unknown>,
    isRender: Ref<boolean> | boolean = true
  ) {
    return defineComponent({
      setup() {
        return { ...refs };
      },
      render() {
        return h(
          VMap,
          { ref: 'mapRef' },
          unref(isRender) ? { default: defaultSlotFn } : undefined
        );
      }
    });
  }

  it('should not render when latlng is null', () => {
    const vm = mount(
      defineComponent({
        setup() {
          return () => h(VMapMarker, { latlng: null });
        }
      })
    );
    expect(vm.$el.nodeType).toBe(Node.COMMENT_NODE);
  });

  it('should be expose instance', () => {
    const vm = mount(
      defineComponent({
        setup() {
          const componentRef = ref<InstanceType<typeof VMapMarker> | null>(
            null
          );

          return { componentRef };
        },
        render() {
          return h(VMapMarker, { latlng, ref: 'componentRef' });
        }
      })
    );

    expect(unref(vm.componentRef)).not.toBeNull();
    expect(vm.componentRef!.marker).toBeInstanceOf(Marker);
  });

  it('should work with latlng ref', async () => {
    const latlngRef = ref(latlng);

    const vm = mount(
      defineComponent({
        setup() {
          const componentRef = ref<InstanceType<typeof VMapMarker> | null>(
            null
          );

          return { componentRef, latlngRef };
        },
        render() {
          return h(VMapMarker, {
            latlng: this.latlngRef,
            ref: 'componentRef'
          });
        }
      })
    );

    expect(unref(vm.componentRef)).not.toBeNull();
    const { marker } = vm.componentRef!;
    expect(marker).toBeInstanceOf(Marker);
    expect(marker?.getLatLng()).toEqual({
      lat: 1,
      lng: 2
    });

    latlngRef.value = [3, 4];
    await nextTick();

    expect(marker?.getLatLng()).toEqual({
      lat: 3,
      lng: 4
    });
  });

  it('should add on map', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const markerRef = ref<InstanceType<typeof VMapMarker> | null>(null);
    mount(
      wrapComponent(() => h(VMapMarker, { latlng, ref: 'markerRef' }), {
        mapRef,
        markerRef
      })
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(markerRef)).toBeTruthy();
    expect(unref(markerRef)?.marker).toBeInstanceOf(Marker);
    expect(
      unref(mapRef)?.map!.hasLayer(unref(markerRef)?.marker!)
    ).toBeTruthy();
  });

  it('should remove from map when component is unmounted', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const markerRef = ref<InstanceType<typeof VMapMarker> | null>(null);
    const isRender = ref(true);
    mount(
      wrapComponent(
        () => h(VMapMarker, { latlng, ref: 'markerRef' }),
        {
          mapRef,
          markerRef
        },
        isRender
      )
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(markerRef)).toBeTruthy();
    const { marker } = unref(markerRef)!;
    expect(marker).toBeInstanceOf(Marker);

    isRender.value = false;

    await nextTick();

    expect(unref(markerRef)).toBeNull();
    expect(marker).toBeInstanceOf(Marker);
    expect(unref(mapRef)?.map!.hasLayer(marker!)).toBeFalsy();
  });
});
