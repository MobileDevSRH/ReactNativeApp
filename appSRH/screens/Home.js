import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native'; 

const { width } = Dimensions.get('window');
const ALBUM_NAME = 'MyAppPhotos';

export default function Home() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return;

    try {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) {
        setPhotos([]); 
        return;
      }

      const assets = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 50,
        mediaType: ['photo'],
        sortBy: [['creationTime', false]], 
      });

      const uris = assets.assets.map(asset => asset.uri);
      setPhotos(uris);
      console.log('Photos refreshed!');
    } catch (err) {
      console.error(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos])
  );

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No photos yet!</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.photo} />}
          numColumns={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5 },
  photo: {
    width: width / 3 - 10,
    height: width / 3 - 10,
    margin: 5,
    borderRadius: 8,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
});