<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { useSlots } from 'vue';
import type { AddPrefix } from '../../utils/types';
import { useSplitAttrs } from '../../composables';
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

const { default: markerAttrs, icon: iconAttrs } = useSplitAttrs(['icon']);
const slots = useSlots() as { default: unknown };
</script>

<template>
  <VMapMarker v-bind="markerAttrs">
    <VMapIcon v-bind="iconAttrs">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapIcon>
  </VMapMarker>
</template>
