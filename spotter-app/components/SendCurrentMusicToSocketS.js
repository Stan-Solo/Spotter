import React from 'react';
import { AsyncStorage } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

async function sendMusicSocketServer(currentMusic, socket) {

  console.log("sendMusicSocketServer");

  currentMusic
  .then((response) => response.json())
  .then((jsonData) => {
    if (jsonData.item !== undefined) {
      let currentAlbum  = jsonData.item.album.name;
      let currentArtist = jsonData.item.album.artists[0].name;
      let currentSong   = jsonData.item.name;
      let currentCover  = jsonData.item.album.images[0].url;

      let currentMusic = {
        album: currentAlbum,
        artist: currentArtist,
        song: currentSong,
        cover: currentCover
      };
      console.log(`${currentAlbum} / ${currentArtist} / ${currentSong}`);
      getGeoLocation(currentMusic);
    }
  }).catch(function(error) {
    console.log('Problem with your currentMusic processing: ' + error.message);
    throw error;
  });

  async function getGeoLocation(currentMusic) {

    const userIdFromSpotify = await AsyncStorage.getItem('userIdFromSpotify');

    try{
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        let locationInfo = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          timestamp: (location.timestamp / 1000)
        };

        socket.emit("usersQueue", {
          currentMusicData: currentMusic,
          locationInfo: locationInfo,
          userInfo: userIdFromSpotify
        });
      }
    } catch(error) {
      console.log('Error when get location.');
      throw error;
    }
  };
}

export { sendMusicSocketServer }