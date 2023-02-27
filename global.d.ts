// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VMapTileLayer: typeof import('vue-map-ui')['VMapTileLayer'];
    VMap: typeof import('vue-map-ui')['VMap'];
    VMapOsmTileLayer: typeof import('vue-map-ui')['VMapOsmTileLayer'];
  }
}

export {};
