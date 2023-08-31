<script setup lang="ts">
import {
  computed,
  ref,
  useSlots,
  getCurrentInstance,
  type StyleValue
} from 'vue';
import type { DivIcon, DivIconOptions, PointExpression } from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { pickProps } from '../../utils/props';
import VMapDivIcon from './VMapDivIcon.vue';

export interface Props extends DivIconOptions {
  color?: string;
  backgroundColor?: string;
  placeholderColor?: string;
  html?: string | HTMLElement | false;
  bgPos?: PointExpression;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  renderMode?: 'html' | 'node' | 'portal' | 'none';
  rootClass?: any;
  knownClasses?: string[];
  class?: any;
  className?: any;
}

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  backgroundColor: undefined,
  placeholderColor: undefined,
  html: undefined,
  bgPos: undefined,
  iconSize: () => [32, 46],
  iconAnchor: () => [16, 46],
  popupAnchor: () => [0, -50],
  renderMode: undefined,
  rootClass: undefined,
  knownClasses: undefined,
  class: undefined,
  className: undefined
});

const instance = getCurrentInstance()!;
const {
  refs: { color, backgroundColor, placeholderColor },
  rest
} = pickProps(
  instance,
  props,
  [
    'color',
    'backgroundColor',
    'placeholderColor',
    'iconSize',
    'iconAnchor',
    'popupAnchor'
  ],
  [],
  true
);

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
    :icon-size="iconSize"
    :icon-anchor="iconAnchor"
    :popup-anchor="popupAnchor"
    v-bind="rest"
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
