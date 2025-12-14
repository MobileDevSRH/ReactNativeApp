import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import WebView from 'react-native-webview';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const TOMTOM_API_KEY = Constants.expoConfig.extra.TOMTOM_API_KEY;

const mapHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>TomTom Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    rel="stylesheet"
    href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css"
  />
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"></script>
  <style>body, html {margin:0; padding:0; height:100%;} #map{width:100%; height:100%;}</style>
</head>
<body>
  <div id="map"></div>
  <script>
    const TOMTOM_API_KEY = window.TOMTOM_API_KEY;
    let map, marker, firstLocation = false, queue = [];

    function updateMarker(lat, lng) {
      const pos = [lng, lat];
      if (!marker) {
        marker = new tt.Marker({color:'#007bff'}).setLngLat(pos).addTo(map);
      } else {
        marker.setLngLat(pos);
      }
      if (!firstLocation) {
        map.setCenter(pos);
        map.setZoom(16);
        firstLocation = true;
      }
    }

    function handleMessage(message) {
      try {
        const payload = JSON.parse(message);
        if (payload.type === 'NEW_LOCATION') {
          const { latitude, longitude } = payload.data;
          if (map && map.loaded()) {
            updateMarker(latitude, longitude);
          } else {
            queue.push({ latitude, longitude });
          }
        }
      } catch(e) { console.error(e); }
    }

    if(TOMTOM_API_KEY){
      map = tt.map({
        key: TOMTOM_API_KEY,
        container: 'map',
        center: [-122.4194,37.7749],
        zoom: 12
      });
      map.on('load', () => {
        while(queue.length>0){
          const loc = queue.shift();
          updateMarker(loc.latitude, loc.longitude);
        }
      });
      function receiveMsg(event){ handleMessage(event.data); }
      document.addEventListener('message', receiveMsg);
      window.addEventListener('message', receiveMsg);
    }
  </script>
</body>
</html>
`;

export default function MapsSRH() {
  const webViewRef = useRef(null);
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    let watcher;
    async function startTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        return;
      }

      watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({
              type:'NEW_LOCATION',
              data: {latitude, longitude}
            }));
          }
          setLocationReady(true);
        }
      );
    }

    startTracking();

    return () => { if(watcher) watcher.remove(); };
  }, []);

  if(!locationReady) return <ActivityIndicator size="large" style={styles.loading} />;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        injectedJavaScriptBeforeContentLoaded={`window.TOMTOM_API_KEY = "${TOMTOM_API_KEY}"; true;`}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1 },
  webview:{ flex:1 },
  loading:{ flex:1, justifyContent:'center', alignItems:'center' },
});
