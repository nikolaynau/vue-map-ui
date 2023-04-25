// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VMapAttributionControl: typeof import('vue-map-ui')['VMapAttributionControl'];
    VMapLayersControl: typeof import('vue-map-ui')['VMapLayersControl'];
    VMapScaleControl: typeof import('vue-map-ui')['VMapScaleControl'];
    VMapZoomControl: typeof import('vue-map-ui')['VMapZoomControl'];
    VMapTileLayer: typeof import('vue-map-ui')['VMapTileLayer'];
    VMap: typeof import('vue-map-ui')['VMap'];
    VMapArcGisAeroTileLayer: typeof import('vue-map-ui')['VMapArcGisAeroTileLayer'];
    VMapArcGisTileLayer: typeof import('vue-map-ui')['VMapArcGisTileLayer'];
    VMapGoogleTileLayer: typeof import('vue-map-ui')['VMapGoogleTileLayer'];
    VMapMapboxTileLayer: typeof import('vue-map-ui')['VMapMapboxTileLayer'];
    VMapOpenTransportTileLayer: typeof import('vue-map-ui')['VMapOpenTransportTileLayer'];
    VMapOsmTileLayer: typeof import('vue-map-ui')['VMapOsmTileLayer'];
  }
}

export {};
