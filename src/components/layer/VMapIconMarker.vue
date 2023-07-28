<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { useSlots } from 'vue';
import type { Icon, Marker } from 'leaflet';
import type { AddPrefix } from '../../utils/types';
import { useSplitAttrs, useTemplateRef } from '../../composables';
import {
  default as VMapMarker,
  type Attrs as MarkerAttrs,
  type Props as MarkerProps
} from './VMapMarker.vue';
import {
  default as VMapIcon,
  type Attrs as IconAttrs,
  type Props as IconProps
} from './VMapIcon.vue';

export type Attrs = MarkerProps &
  MarkerAttrs &
  AddPrefix<IconProps, 'icon'> &
  AddPrefix<IconAttrs, 'icon'>;

const attrs = useSplitAttrs(['icon']);
const slots = useSlots() as { default: unknown };

const { templateRef: markerRef, value: marker } = useTemplateRef<
  InstanceType<typeof VMapMarker>,
  Marker | null
>(obj => obj.marker);

const { templateRef: iconRef, value: icon } = useTemplateRef<
  InstanceType<typeof VMapIcon>,
  Icon | null
>(obj => obj.icon);

defineExpose({
  marker,
  icon
});
</script>

<template>
  <VMapMarker ref="markerRef" v-bind="attrs.default">
    <VMapIcon ref="iconRef" v-bind="attrs.icon">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapIcon>
  </VMapMarker>
</template>
