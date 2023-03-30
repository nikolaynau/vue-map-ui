import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
import { Control } from 'leaflet';
import { mount as _mount } from '../../../../.test';
import VMapLayersControl from '../VMapLayersControl.vue';
import { useApi } from '../../../composables';
import { layersControlApiKey } from '../composables';
import { mount } from '@vue/test-utils';

describe('VMapLayersControl', () => {
  it('should be expose instance', () => {
    const vm = _mount(VMapLayersControl);
    expect(vm.layersControl).not.toBeNull();
    expect(vm.layersControl).toBeInstanceOf(Control.Layers);
  });

  it('should be provide api', () => {
    expect.assertions(3);

    const Child = defineComponent({
      setup() {
        const api = useApi(layersControlApiKey);
        expect(api != null).toBeTruthy();
        expect(api!.add).toBeTypeOf('function');
        expect(api!.remove).toBeTypeOf('function');
        return () => null;
      }
    });
    mount(VMapLayersControl as any, { slots: { default: Child } });
  });
});
