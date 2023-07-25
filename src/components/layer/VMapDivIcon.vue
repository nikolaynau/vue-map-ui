<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import {
  markRaw,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  toRefs,
  useSlots,
  watch
} from 'vue';
import { isDefined, syncRef, toRef, toValue } from '@vueuse/shared';
import type { MaybeComputedElementRef } from '@vueuse/core';
import type { DivIconOptions, PointExpression } from 'leaflet';
import { useLeafletDivIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi, useAttrs, useCssClass } from '../../composables';
import { provideDivIcon, markerApiKey } from './composables';

export interface Props {
  html?: string | HTMLElement | false;
  bgPos?: PointExpression;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  updateMode?: 'html' | 'node' | 'portal' | 'none';
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
syncRef(toRef(html), _html, { immediate: true, direction: 'ltr' });

const rootEl = ref<HTMLElement | null>(null);

const { attrs } = useAttrs();
const slots = useSlots();
const hasSlot = (name: string) => !!slots[name];
const hasDefaultSlot = hasSlot('default');

const icon = useLeafletDivIcon(_html, {
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

if (hasDefaultSlot && updateMode?.value === 'portal') {
  rootEl.value = markRaw(document.createElement('div'));
  _html.value = rootEl.value;

  useCssClass(rootEl, rootClass);
}

if (hasDefaultSlot && updateMode?.value === 'node') {
  onMounted(() => {
    detach(rootEl);
    _html.value = rootEl.value;
  });

  useCssClass(rootEl, rootClass);
}

if (hasDefaultSlot && (!updateMode?.value || updateMode.value === 'html')) {
  onMounted(() => {
    detach(rootEl);
    update(rootEl);
  });

  onUpdated(() => {
    update(rootEl);
  });
}

function detach(el: MaybeComputedElementRef<HTMLElement | null>) {
  if (isDefined(el)) {
    const _el = toValue(el)!;
    _el.parentNode?.removeChild(_el);
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
  <template v-if="hasDefaultSlot">
    <Teleport v-if="updateMode === 'portal'" :to="rootEl">
      <slot v-if="ready"></slot>
    </Teleport>
    <div v-else-if="updateMode !== 'none'" ref="rootEl">
      <slot v-if="ready"></slot>
    </div>
    <slot v-else-if="ready"></slot>
  </template>
</template>
