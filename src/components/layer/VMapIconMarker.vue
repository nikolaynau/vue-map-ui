<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue';
import type {
  CrossOrigin,
  Icon,
  LatLngExpression,
  Marker,
  MarkerOptions,
  PointExpression
} from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { splitProps } from '../../utils/props';
import VMapMarker from './VMapMarker.vue';
import VMapIcon from './VMapIcon.vue';

export interface Props extends MarkerOptions {
  latlng: LatLngExpression | null;
  iconUrl: string | null;
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
const splitted = splitProps(
  instance,
  props,
  'icon',
  ['latlng', 'iconUrl'],
  true,
  true,
  ['iconRetinaUrl', 'iconSize', 'iconAnchor']
);
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
  <VMapMarker ref="markerRef" :latlng="latlng" v-bind="splitted.rest">
    <VMapIcon ref="iconRef" :icon-url="iconUrl" v-bind="splitted.matching">
      <template v-if="slots.default" #default>
        <slot></slot>
      </template>
    </VMapIcon>
  </VMapMarker>
</template>
