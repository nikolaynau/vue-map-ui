// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VMapLayersControl: typeof import('vue-map-ui')['VMapLayersControl'];
    VMapTileLayer: typeof import('vue-map-ui')['VMapTileLayer'];
    VMap: typeof import('vue-map-ui')['VMap'];
    VMapOsmTileLayer: typeof import('vue-map-ui')['VMapOsmTileLayer'];
  }
}

export {};
