import React from 'react';
import { AsyncStorage } from 'react-native';

async function getUserProfile(userToken) {
  try {
    const userProfile = await fetch(`https://api.spotify.com/v1/me`, {
       method: 'GET',
       headers: {
        'Authorization': "Bearer " + userToken
      }
    });

    return userProfile;
  } catch(error) {
    console.log('Problem with your fetch operation: ' + error.message);
    throw error;
  }
}

export { getUserProfile }