// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VMapAttributionControl: typeof import('vue-map-ui')['VMapAttributionControl'];
    VMapControlPosition: typeof import('vue-map-ui')['VMapControlPosition'];
    VMapLayersControl: typeof import('vue-map-ui')['VMapLayersControl'];
    VMapScaleControl: typeof import('vue-map-ui')['VMapScaleControl'];
    VMapZoomControl: typeof import('vue-map-ui')['VMapZoomControl'];
    VMapDefaultIcon: typeof import('vue-map-ui')['VMapDefaultIcon'];
    VMapDivIcon: typeof import('vue-map-ui')['VMapDivIcon'];
    VMapDivMarker: typeof import('vue-map-ui')['VMapDivMarker'];
    VMapIcon: typeof import('vue-map-ui')['VMapIcon'];
    VMapIconMarker: typeof import('vue-map-ui')['VMapIconMarker'];
    VMapMarker: typeof import('vue-map-ui')['VMapMarker'];
    VMapPinIcon: typeof import('vue-map-ui')['VMapPinIcon'];
    VMapPinMarker: typeof import('vue-map-ui')['VMapPinMarker'];
    VMapTileLayer: typeof import('vue-map-ui')['VMapTileLayer'];
    VMap: typeof import('vue-map-ui')['VMap'];
    VMapPane: typeof import('vue-map-ui')['VMapPane'];
    VMapArcGisAeroTileLayer: typeof import('vue-map-ui')['VMapArcGisAeroTileLayer'];
    VMapArcGisTileLayer: typeof import('vue-map-ui')['VMapArcGisTileLayer'];
    VMapGoogleTileLayer: typeof import('vue-map-ui')['VMapGoogleTileLayer'];
    VMapMapboxTileLayer: typeof import('vue-map-ui')['VMapMapboxTileLayer'];
    VMapOpenTransportTileLayer: typeof import('vue-map-ui')['VMapOpenTransportTileLayer'];
    VMapOsmTileLayer: typeof import('vue-map-ui')['VMapOsmTileLayer'];
  }
}

export {};
