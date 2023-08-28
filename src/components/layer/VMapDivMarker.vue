<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue';
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
import VMapDivIcon from './VMapDivIcon.vue';

export interface Props extends MarkerOptions {
  latlng: LatLngExpression | null;
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

const instance = getCurrentInstance()!;
const splitted = splitProps(instance, props, 'icon', ['latlng'], true, true, [
  'iconRetinaUrl',
  'iconSize',
  'iconAnchor'
]);

const slots = useSlots() as { default: unknown };

const { templateRef: markerRef, value: marker } = useTemplateRef<
  InstanceType<typeof VMapMarker>,
  Marker | null
>(obj => obj.marker);

const { templateRef: iconRef, value: icon } = useTemplateRef<
  InstanceType<typeof VMapDivIcon>,
  DivIcon | null
>(obj => obj.icon);

defineExpose({
  marker,
  icon
});
</script>

<template>
  <VMapMarker ref="markerRef" :latlng="latlng" v-bind="splitted.rest">
    <VMapDivIcon ref="iconRef" v-bind="splitted.matching">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapDivIcon>
  </VMapMarker>
</template>
