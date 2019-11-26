<template>
<div style="width:100%;height:100%;margin:0;padding:0;">
  <!-- <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" style="height: 400px">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-layer-tile id="osm">
          <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
  </vl-map> -->
  <div id="003" style="height:100%;margin-left:200px;margin:0;padding:0;">
    <iframe src="http://localhost:8080/geoserver/fuzhou/wms?service=WMS&version=1.1.0&request=GetMap&layers=fuzhou%3Afuzhou&bbox=4.038659139582E7%2C2854088.8718000003%2C4.0441987310100004E7%2C2944536.97333164&width=470&height=768&srs=EPSG%3A2364&format=application/openlayers"
           width="100%" height="100%" frameborder="0" scrolling="yes" marginheight="0" marginwidth="0"
    ></iframe>
</div>
  </div>
</template>

<script>
  export default {
    data () {
      return { 
        zoom: 2,
        center: [0, 0],
        rotation: 0,
      }
    },
  }
</script>