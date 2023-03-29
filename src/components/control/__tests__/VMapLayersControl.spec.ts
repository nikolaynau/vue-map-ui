import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
import { Control } from 'leaflet';
import { mount } from '@vue/test-utils';
import VMapLayersControl from '../VMapLayersControl.vue';
import { useApi } from '../../../composables';
import { apiKeys } from '../../../utils/injectionSymbols';

describe('VMapLayersControl', () => {
  it('should be expose instance', () => {
    const wrapper = mount(VMapLayersControl as any);
    expect(wrapper.vm.layersControl).not.toBeNull();
    expect(wrapper.vm.layersControl).toBeInstanceOf(Control.Layers);
  });

  it('should be provide api', () => {
    expect.assertions(3);

    const Child = defineComponent({
      setup() {
        const api = useApi(apiKeys.layersControlKey);
        expect(api != null).toBeTruthy();
        expect(api!.add).toBeTypeOf('function');
        expect(api!.remove).toBeTypeOf('function');
        return () => null;
      }
    });
    mount(VMapLayersControl as any, { slots: { default: Child } });
  });
});
