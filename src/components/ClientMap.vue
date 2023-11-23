<template>
  <GoogleMap api-key="AIzaSyB6wRfuiMoXlqkABJ9zrjdRKFLYZatSjqM" @click="emitSelectedValue" :center="center" style="width: 100%; height: 400px" :zoom="15">
    <Marker :options="markerOptions" />
  </GoogleMap>
</template>

<script>
import {GoogleMap, Marker} from "vue3-google-map";

export default {
  components: {GoogleMap, Marker},
  props: {
    client: {type: Object, required: true},
  },
  data() {
    let lat = this.client.latitude === undefined ? 35.55 : parseFloat(this.client.latitude) //TODO set to some default configuration from server
    let lng = this.client.longitude === undefined ? 35.55 : parseFloat(this.client.longitude)
    return {
      center: {lat: lat, lng: lng},
      markerOptions: { position: this.center }
    };
  },
  methods: {
    emitSelectedValue(event) {
      this.$emit("input", event);
    },
  },
  watch: {
    client: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.latitude && newVal.longitude) {
          this.center = { lat: parseFloat(newVal.latitude), lng: parseFloat(newVal.longitude) };
          this.markerOptions = { position: this.center };
        }
      },
    },
  },
};
</script>
