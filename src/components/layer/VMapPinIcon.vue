<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  toRefs,
  useSlots,
  type StyleValue
} from 'vue';
import type { DivIcon } from 'leaflet';
import { useTemplateRef } from '../../composables';
import {
  default as VMapDivIcon,
  type Attrs as IconAttrs,
  type Props as IconProps
} from './VMapDivIcon.vue';

export interface Props extends IconProps {
  color?: string;
  backgroundColor?: string;
  placeholderColor?: string;
}

export type Attrs = IconAttrs;

const props = withDefaults(defineProps<Props>(), {
  iconSize: () => [32, 46],
  iconAnchor: () => [16, 46],
  color: undefined,
  backgroundColor: undefined,
  placeholderColor: undefined
});

const { color, backgroundColor, placeholderColor, ..._iconProps } =
  toRefs(props);
const iconProps = reactive(_iconProps);
const slots = useSlots() as { default: unknown };
const popupAnchor = ref([0, -50]);

const pinStyle = computed<StyleValue>(() => ({
  color: backgroundColor.value ?? color.value
}));

const iconStyle = computed<StyleValue>(() => ({
  color: color.value,
  backgroundColor: placeholderColor.value
}));

const { templateRef, value: icon } = useTemplateRef<
  InstanceType<typeof VMapDivIcon>,
  DivIcon | null
>(obj => obj.icon);

defineExpose({
  icon
});
</script>

<template>
  <VMapDivIcon
    ref="templateRef"
    class="v-map-pin-icon"
    v-bind="iconProps"
    :popup-anchor="popupAnchor"
  >
    <div class="v-map-pin-icon__shadow"></div>
    <div class="v-map-pin-icon__pin" :style="pinStyle"></div>
    <div class="v-map-pin-icon__icon" v-if="slots.default" :style="iconStyle">
      <slot></slot>
    </div>
  </VMapDivIcon>
</template>

<style>
@import 'pin-icon';
</style>
