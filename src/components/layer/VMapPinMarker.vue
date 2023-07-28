<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { useSlots } from 'vue';
import type { DivIcon, Marker } from 'leaflet';
import type { AddPrefix } from '../../utils/types';
import { useSplitAttrs, useRef } from '../../composables';
import {
  default as VMapMarker,
  type Attrs as MarkerAttrs,
  type Props as MarkerProps
} from './VMapMarker.vue';
import {
  default as VMapPinIcon,
  type Attrs as IconAttrs,
  type Props as IconProps
} from './VMapPinIcon.vue';

export type Attrs = MarkerProps &
  MarkerAttrs &
  AddPrefix<IconProps, 'icon'> &
  AddPrefix<IconAttrs, 'icon'>;

const { default: markerAttrs, icon: iconAttrs } = useSplitAttrs(['icon']);
const slots = useSlots() as { default: unknown };

const { templateRef: markerRef, value: marker } = useRef<
  InstanceType<typeof VMapMarker>,
  Marker | null
>(obj => obj.marker);

const { templateRef: iconRef, value: icon } = useRef<
  InstanceType<typeof VMapPinIcon>,
  DivIcon | null
>(obj => obj.icon);

defineExpose({
  marker,
  icon
});
</script>

<template>
  <VMapMarker ref="markerRef" v-bind="markerAttrs">
    <VMapPinIcon ref="iconRef" v-bind="iconAttrs">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapPinIcon>
  </VMapMarker>
</template>
