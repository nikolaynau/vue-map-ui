<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue';
import { useVModel } from '@vueuse/core';
import type {
  CrossOrigin,
  DivIcon,
  LatLngExpression,
  Marker,
  MarkerOptions,
  PointExpression
} from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { splitProps } from '../../utils/props';
import VMapMarker from './VMapMarker.vue';
import VMapPinIcon from './VMapPinIcon.vue';

export interface Props extends MarkerOptions {
  latlng: LatLngExpression | null;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconPlaceholderColor?: string;
  iconHtml?: string | HTMLElement | false;
  iconBgPos?: PointExpression;
  iconRenderMode?: 'html' | 'node' | 'portal' | 'none';
  iconRootClass?: any;
  iconUrl?: string;
  iconRetinaUrl?: string;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  iconShadowUrl?: string;
  iconShadowRetinaUrl?: string;
  iconShadowSize?: PointExpression;
  iconShadowAnchor?: PointExpression;
  iconKnownClasses?: string[];
  iconClass?: any;
  iconClassName?: any;
  iconCrossOrigin?: CrossOrigin | boolean;
  iconPopupAnchor?: PointExpression;
  iconTooltipAnchor?: PointExpression;
  iconPane?: string;
  iconAttribution?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (type: 'update:latlng', value: LatLngExpression): void;
}>();

const instance = getCurrentInstance()!;
const splitted = splitProps(instance, props, 'icon', ['latlng'], true, true, [
  'iconRetinaUrl',
  'iconSize',
  'iconAnchor'
]);

const slots = useSlots() as { default: unknown };
const latlng = useVModel(props, 'latlng', emit);

const { templateRef: markerRef, value: marker } = useTemplateRef<
  InstanceType<typeof VMapMarker>,
  Marker | null
>(obj => obj.marker);

const { templateRef: iconRef, value: icon } = useTemplateRef<
  InstanceType<typeof VMapPinIcon>,
  DivIcon | null
>(obj => obj.icon);

defineExpose({
  marker,
  icon
});
</script>

<template>
  <VMapMarker ref="markerRef" v-model:latlng="latlng" v-bind="splitted.rest">
    <VMapPinIcon ref="iconRef" v-bind="splitted.matching">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapPinIcon>
  </VMapMarker>
</template>
