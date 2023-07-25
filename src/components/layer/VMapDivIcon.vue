<script lang="ts">
import { defineComponent } from 'vue';
import type { MaybeComputedElementRef } from '@vueuse/core';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  toRefs,
  useSlots,
  watch
} from 'vue';
import { isDefined, syncRef, toRef, toValue, whenever } from '@vueuse/shared';
import type { DivIconOptions, PointExpression } from 'leaflet';
import { useLeafletDivIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi, useAttrs, useCssClass } from '../../composables';
import { provideDivIcon, markerApiKey } from './composables';

export interface Props {
  html?: string | HTMLElement | false;
  updateMode?: 'html' | 'node' | 'none';
  bgPos?: PointExpression;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  rootClass?: any;
  knownClasses?: string[];
  class?: any;
}

export type Attrs = DivIconOptions;

const props = defineProps<Props>();

const {
  html,
  class: className,
  updateMode,
  rootClass,
  ...options
} = toRefs(props);

const _html = ref<string | HTMLElement | null | undefined>(null);
const rootEl = ref<HTMLElement | null>(null);

const { attrs } = useAttrs();
const slots = useSlots();
debugger;
const hasSlot = (name: string) => !!slots[name];
const hasDefaultSlot = hasSlot('default');

const icon = useLeafletDivIcon(html, {
  ...options,
  className,
  ...attrs
});
const ready = useLeafletReady(icon);

const markerApi = useApi(markerApiKey);
if (markerApi) {
  watch(
    icon,
    val => {
      markerApi.setIcon(val);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    markerApi.setIcon(null);
  });
}

if (hasDefaultSlot && updateMode?.value === 'node') {
  debugger;
  whenever(rootEl, () => {
    debugger;
    _html.value = rootEl.value;
  });

  useCssClass(rootEl, rootClass);
}

if (hasDefaultSlot && (!updateMode?.value || updateMode.value === 'html')) {
  onMounted(() => {
    debugger;
    if (isDefined(rootEl)) {
      _html.value = rootEl.value.innerHTML;
      rootEl.value.parentNode?.removeChild(rootEl.value);
    }
  });

  onUpdated(() => {
    debugger;
    update(rootEl);
  });
}

syncRef(toRef(html), _html, { immediate: true, direction: 'ltr' });

function detach(el: MaybeComputedElementRef<HTMLElement | null>) {
  if (isDefined(rootEl)) {
    _html.value = rootEl.value.innerHTML;
    rootEl.value.parentNode?.removeChild(rootEl.value);
  }
}

function update(el: MaybeComputedElementRef<HTMLElement | null>) {
  if (isDefined(el)) {
    _html.value = toValue(el)!.innerHTML;
  }
}

provideDivIcon(icon);

defineExpose({
  divIcon: icon
});
</script>

<template>
  <template v-if="ready && hasDefaultSlot">
    <div v-if="updateMode !== 'none'" ref="rootEl">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </template>
</template>
