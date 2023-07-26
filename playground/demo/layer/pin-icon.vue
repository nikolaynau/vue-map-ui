<script setup lang="ts">
import { VMap, VMapMarker, VMapOsmTileLayer, VMapPinIcon } from 'vue-map-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCloud, faHouse, faArrowUp } from '@fortawesome/free-solid-svg-icons';

library.add(faCloud, faHouse, faArrowUp);
</script>

<template>
  <VMap style="height: 300px" :zoom="1">
    <VMapOsmTileLayer />
    <VMapMarker :latlng="[0, 0]">
      <VMapPinIcon
        color="#ffccaa"
        background-color="#ccaaee"
        placeholder-color="#ddffaa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          />
        </svg>
      </VMapPinIcon>
    </VMapMarker>
    <VMapMarker :latlng="[-25, -20]">
      <VMapPinIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path
            d="M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"
          />
        </svg>
      </VMapPinIcon>
    </VMapMarker>
    <VMapMarker :latlng="[-40, 0]">
      <VMapPinIcon>
        <FontAwesomeIcon icon="fas fa-house" />
      </VMapPinIcon>
    </VMapMarker>
    <VMapMarker :latlng="[-55, -20]">
      <VMapPinIcon>
        <FontAwesomeIcon icon="fas fa-arrow-up" />
      </VMapPinIcon>
    </VMapMarker>
    <VMapMarker :latlng="[-60, 10]">
      <VMapPinIcon>
        <i class="fa-solid fa-bolt-lightning"></i>
      </VMapPinIcon>
    </VMapMarker>
  </VMap>
</template>
