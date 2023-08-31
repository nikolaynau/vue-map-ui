<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import {
  getCurrentInstance,
  useAttrs,
  markRaw,
  onUnmounted,
  onUpdated,
  ref,
  useSlots,
  watch
} from 'vue';
import { isDefined, syncRef, toRef, toValue } from '@vueuse/shared';
import type { MaybeComputedElementRef } from '@vueuse/core';
import type { DivIconOptions, PointExpression } from 'leaflet';
import { useLeafletDivIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi } from '../../composables/useApi';
import { useCssClass } from '../../composables/internal/useCssClass';
import { useMergeCss } from '../../composables/internal/useMergeCss';
import { pickAttrs, pickProps } from '../../utils/props';
import { provideDivIcon } from './composables/useDivIcon';
import { markerApiKey } from './composables/injectionSymbols';

export interface Props extends DivIconOptions {
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

const props = defineProps<Props>();

const instance = getCurrentInstance()!;
const {
  refs: { html, class: _class, className, renderMode, rootClass, ...more },
  rest
} = pickProps(instance, props, [
  'html',
  'bgPos',
  'iconSize',
  'iconAnchor',
  'renderMode',
  'rootClass',
  'knownClasses',
  'class',
  'className'
]);

const attrs = useAttrs();
const slots = useSlots() as { default: unknown };

const _html = ref<string | HTMLElement | null | undefined>(null);
syncRef(toRef(html), _html, { immediate: true, direction: 'ltr' });

const rootEl = ref<HTMLElement | null>(null);
const cssClass = useMergeCss(_class, className);

const icon = useLeafletDivIcon(_html, {
  className: cssClass,
  ...more,
  ...rest,
  ...pickAttrs(attrs)
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

if (slots.default && renderMode?.value === 'portal') {
  rootEl.value = markRaw(document.createElement('div'));
  _html.value = rootEl.value;

  useCssClass(rootEl, rootClass);
}

if (slots.default && renderMode?.value === 'node') {
  watch(
    rootEl,
    () => {
      detach(rootEl);
      _html.value = rootEl.value;
    },
    { flush: 'sync' }
  );

  useCssClass(rootEl, rootClass);
}

if (slots.default && (!renderMode?.value || renderMode.value === 'html')) {
  watch(
    rootEl,
    () => {
      detach(rootEl);
      update(rootEl);
    },
    { flush: 'sync' }
  );

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
  icon
});
</script>

<template>
  <template v-if="slots.default">
    <Teleport v-if="renderMode === 'portal'" :to="rootEl">
      <slot v-if="ready"></slot>
    </Teleport>
    <div v-else-if="renderMode !== 'none'" ref="rootEl">
      <slot v-if="ready"></slot>
    </div>
    <slot v-else-if="ready"></slot>
  </template>
</template>

<style>
@import 'div-icon';
</style>
