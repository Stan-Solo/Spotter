
import React from 'react';
import {
  View,
  Button,
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  Form,
  TextInput,
  Alert,
  TouchableHighlight,
  Image,
  ScrollView
} from 'react-native';

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      nodeServerUrl: null,
      socketServerUrl: null,
      userIdFromSpotify: null,
      email: null,
      favoriteGenres: [],
      favoriteArtists: [],
      favoriteSongs: [],
      favoriteType: "Genre",
      displayInfo: true,
      favoriteContent: '',
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this._getUserInfo);
  }

  static navigationOptions = {
    header: null,
  };

  render() {

    const favoriteInfo = this._selectfavorite(this.state.favoriteType);
    const editOrDisplay = this._selectPageContent(favoriteInfo, this.state.favoriteType);
    const editTitle = `Add Favorite ${this.state.favoriteType}`;
    let profilePic = (this.state.avatar) ?
      (<Image style={{justifyContent: 'center',alignItems: 'center',width: 175, height: 175,}} source={{uri: this.state.avatar}}/>) :
      (<Image style={{justifyContent: 'center',alignItems: 'center',width: 175, height: 175,}} source={{uri: "https://www.nocowboys.co.nz/images/v3/no-image-available.png"}} />);

    return (
      <View style={{alignItems: 'center',}}>
        <Text style={styles.name}>Profile</Text>
          {profilePic}
          <View style={{alignItems:'flex-start'}}>
            <Text style={
                {
                  fontSize: 20,

                }
              }
              >
                Id: {this.state.userIdFromSpotify}
              </Text>
              <Text style={
                {
                  fontSize: 20,
                 }
               }
              >
              Email: {this.state.email}
            </Text>
          </View>
          {editOrDisplay}
          {favoriteInfo}
        <Text></Text>
        <TouchableOpacity
          style={
            {
              backgroundColor: 'white',
              width: 200,
              height: 30,
              justifyContent: 'center',
              alignItems:'center',
              borderRadius:10,
              borderWidth:2,
            }
          }
          onPress={this._editInfo}>
          <Text style={{fontSize:20,color:'black',fontWeight: 'bold'}}>
            {editTitle}
          </Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableHighlight
          style={{justifyContent: 'center',alignItems: 'center'}}
          onPress={this._signOutAsync}>
          <Image
            style={{width: 60, height: 60}}
            source={{uri: "https://cdn2.iconfinder.com/data/icons/picons-essentials/57/logout-512.png"}}
          />
        </TouchableHighlight>
      </View>
    );
  }

  _editInfo = () => {
    this.setState({displayInfo: !this.state.displayInfo});
  };

  _selectPageContent = (favoriteInfo, type) => {

    let addNewPlaceHolder = `New ${type}`;

    if (this.state.displayInfo) {
      return (
        <View style={{flexDirection: 'row',}}>
          <TouchableOpacity
            style={{
             borderWidth:0.5,
             borderColor:'rgba(0,0,0,0.2)',
             alignItems:'center',
             justifyContent:'center',
             width:70,
             height:70,
             backgroundColor:'powderblue',
             borderRadius:50,
           }}
            onPress={this._accessGenere}>
            <Text style={styles.text}>Genre</Text>
          </TouchableOpacity>
          <Text>          </Text>
          <TouchableOpacity
            style={{
             borderWidth:0.5,
             borderColor:'rgba(0,0,0,0.2)',
             alignItems:'center',
             justifyContent:'center',
             width:70,
             height:70,
             backgroundColor:'skyblue',
             borderRadius:50,
           }}
            onPress={this._accessArtist}>
            <Text style={styles.text}>Artist</Text>
          </TouchableOpacity>
          <Text>          </Text>
          <TouchableOpacity
            style={{
             borderWidth:0.5,
             borderColor:'rgba(0,0,0,0.2)',
             alignItems:'center',
             justifyContent:'center',
             width:70,
             height:70,
             backgroundColor:'steelblue',
             borderRadius:50,
           }}
            onPress={this._accessSong}>
            <Text style={styles.text}>Song</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.AddNewcontainer}>
          <TextInput style={
            {
              width: 120,
              borderColor: 'gray',
              borderWidth: 1,
            }
          }
          onChangeText={(text) => this.setState({favoriteContent: text})}
          value={this.state.favoriteContent}
          placeholder={addNewPlaceHolder} />
        <Button title='Submit' onPress={this._addNewValue} />
        </View>
      );
    }
  };

  _addNewValue = () => {
    console.log(this.state.favoriteContent);
    console.log(this.state.favoriteType);
    if (this.state.favoriteContent !== '') {
      let updateData = null;

      console.log("before switch:");

      switch (this.state.favoriteType) {
        case "Genre":
          updateData = this.state.favoriteGenres;
          updateData.push(this.state.favoriteContent);
          this.setState({favoriteGenres: updateData});
          break;
        case "Artist":
          updateData = this.state.favoriteArtists;
          updateData.push(this.state.favoriteContent);
          this.setState({favoriteArtists: updateData});
          break;
        case "Song":
          updateData = this.state.favoriteSongs;
          updateData.push(this.state.favoriteContent);
          this.setState({favoriteSongs: updateData});
          break;
      }

      console.log("updateData:");
      console.log(updateData);

      this._updateFavoriteDb(this.state.favoriteType, updateData);

      this.setState({favoriteContent: ''});
      this._editInfo();

    }
  };

  _selectfavorite = (type) => {
    switch (type) {
      case "Genre":
        return (
          <ScrollView style={{height:80}}>
           {
            this.state.favoriteGenres.map((item, index) => (
              <View key = {index}>
                <Text
                  style={{}}
                  onLongPress={() => Alert.alert(
                    'Delete Genre',
                    item,
                    [
                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                      {text: 'OK', onPress: () => this._deleteFavoriteItem("Genre", item)},
                    ]
                  )}
                >
                {item}
                </Text>
              </View>
            ))
           }
          </ScrollView>
        );
      case "Artist":
        if (this.state.favoriteArtists !== null) {
          return (
            <ScrollView style={{height:80}}>
             {
              this.state.favoriteArtists.map((item, index) => (
                 <View key = {index}>
                  <Text
                    style={{}}
                    onLongPress={() => Alert.alert(
                      'Delete Artist',
                      item,
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () => this._deleteFavoriteItem("Artist", item)},
                      ]
                    )}
                  >
                  {item}
                  </Text>
                </View>
              ))
             }
            </ScrollView>
          );
        }
        break;
      case "Song":
        return (
          <ScrollView style={{height:80}}>
           {
            this.state.favoriteSongs.map((item, index) => (
              <View key = {index}>
                <Text
                  style={{}}
                  onLongPress={() => Alert.alert(
                    'Delete Song',
                    item,
                    [
                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                      {text: 'OK', onPress: () => this._deleteFavoriteItem("Song", item)},
                    ]
                  )}
                >
                {item}
                </Text>
              </View>
            ))
           }
          </ScrollView>
        );
    };
  };

  _updateFavoriteDb = async (favoriteType, newData) => {

    fetch(`${this.state.nodeServerUrl}/profile/edit/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.state.userIdFromSpotify,
        type: favoriteType,
        favoriteData: newData
      }),
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      this._signOutAsync();
    });
  };

  _deleteFavoriteItem = (favoriteType, item) => {
    let index = -1;
    switch (favoriteType) {
      case "Genre":
        let newFavoriteGenres = [];
        this.state.favoriteGenres.map((genre) => {
          if (genre !== item) {
            newFavoriteGenres.push(genre);
          }
        });

        this._updateFavoriteDb("Genre", newFavoriteGenres);
        this.setState({favoriteGenres: newFavoriteGenres})
        break;
      case "Artist":
        let newFavoriteArtists = [];
        this.state.favoriteArtists.map((artist) => {
          if (artist !== item) {
            newFavoriteArtists.push(artist);
          }
        });

        this._updateFavoriteDb("Artist", newFavoriteArtists);
        this.setState({favoriteArtists: newFavoriteArtists})
        break;
      case "Song":
        let newFavoriteSongs = [];
        this.state.favoriteSongs.map((song) => {
          if (song !== item) {
            newFavoriteSongs.push(song);
          }
        });

        this._updateFavoriteDb("Song", newFavoriteSongs);
        this.setState({favoriteSongs: newFavoriteSongs})
        break;
      break;
    };
  };

  _accessGenere = () => {
    this.setState({favoriteType: "Genre"});
  };

  _accessArtist = () => {
    this.setState({favoriteType: "Artist"});
  };

  _accessSong = () => {
    this.setState({favoriteType: "Song"});
  };

  _getUserInfo = async () => {

    const email               = await AsyncStorage.getItem('email');
    const userToken           = await AsyncStorage.getItem('userToken');
    const userIdFromSpotify   = await AsyncStorage.getItem('userIdFromSpotify');
    const nodeServerUrl       = await AsyncStorage.getItem('nodeServerUrl');
    const socketServerUrl     = await AsyncStorage.getItem('socketServerUrl');

    this.setState({email: email});
    this.setState({userToken: userToken});
    this.setState({userIdFromSpotify: userIdFromSpotify});
    this.setState({nodeServerUrl: nodeServerUrl});
    this.setState({socketServerUrl: socketServerUrl});

    fetch(`${nodeServerUrl}/profile/user_info/${userIdFromSpotify}`, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json'
       }
     })
    .then((response) => response.json())
    .then((jsonData) => {

      if (jsonData.avatar) {
        this.setState({avatar: jsonData.avatar});
      }

      if (jsonData.favoriteGenres) {
        this.setState({favoriteGenres: jsonData.favoriteGenres});
      }

      if (jsonData.favoriteArtists) {
        this.setState({favoriteArtists: jsonData.favoriteArtists});
      }

      if (jsonData.favoriteSongs) {
        this.setState({favoriteSongs: jsonData.favoriteSongs});
      }
    })
    .catch((error) => {
      console.error(error);
      this._signOutAsync();
    });
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  favoriteBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 25,
  },
  favoriteText: {
    backgroundColor: '#fff',
  },
  AddNewcontainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 50,
    textAlign: 'center'
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
  }
});