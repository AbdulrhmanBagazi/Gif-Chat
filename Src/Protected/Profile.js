import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Modal,
  StatusBar,
  Keyboard,
  FlatList,
  Alert
} from 'react-native';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import { Header, Body, Item, Input, Form, Label } from 'native-base';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class Profile extends Component {
  state = {
    modalVisible: false,
    topic: '',
    searchResults: []
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // When the component receives new props (e.g., when the user searches)...
  componentWillReceiveProps(nextProps) {
    // We will run the fetchData() function with the topic as an argument.
    this.fetchData(nextProps.topic);
  }

  // The fetchData function makes an AJAX call to Giphy API.
  fetchData() {
    Keyboard.dismiss();
    // We pass the topic the user entered in into the URL for the API call.
    fetch(`https://api.giphy.com/v1/gifs/search?q=${this.state.topic}&api_key=88pVGgGsktqBi1AJ1mQiPqPGZyxDt4Qu`)
      .then(response => response.json())
      .then(responseData => {
        console.log('Response data: ' + responseData);
        var giphyArray = responseData.data;
        console.log('The array of giphs: ' + giphyArray);
        console.log('Show me image url: ' + giphyArray[0].images.fixed_width_small.url);
        this.setState({ searchResults: giphyArray });
      })
      .catch(err => console.log(err));
  }

  addGif(item) {
    const db = firebase.firestore();

    if (this.props.store.username !== '') {
      db.collection('Users')
        .doc(this.props.store.user.uid)
        .set({
          name: this.props.store.username,
          moodGIF: item.images.fixed_width.webp
        });

      this.props.store.Gif = item.images.fixed_width.webp;
      this.setModalVisible(!this.state.modalVisible);
    } else {
    }
  }

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.store.useremail = null;
      Actions.reset('Auth');
    } catch (error) {}
  };

  logout() {
    Alert.alert('Sign Out', 'Are you sure', [{ text: 'cancel' }, { text: 'yes', onPress: () => this.signOutUser() }], {
      cancelable: false
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#ffffff' }}>
          <Body>
            <Text style={styles.Titleheader}>Profile</Text>
          </Body>
        </Header>

        <StatusBar backgroundColor="#82589F" barStyle="light-content" />

        <View style={styles.boxone}>
          <Image resizeMethod={'auto'} style={styles.gif} source={{ uri: this.props.store.Gif }} />
          <TouchableHighlight
            style={styles.Button}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
            underlayColor="transparent">
            <Icon style={styles.ButtonText} name="edit" />
          </TouchableHighlight>
        </View>

        <View style={styles.boxtwo}>
          <View style={styles.infoView}>
            <Text style={styles.usernameText}>{this.props.store.username}</Text>
          </View>

          <View style={styles.infoView}>
            <TouchableHighlight
              underlayColor="rgba(130, 88, 159,1)"
              style={styles.SignoutButton}
              onPress={this.logout.bind(this)}>
              <Text style={styles.signoutButtonText}>Sign Out</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.boxthree}>
          {/* <TouchableHighlight style={styles.userGif}>
            <Text style={styles.yourgifs}>Your Gifs</Text>
          </TouchableHighlight> */}
          <Icon name="user-circle" style={styles.DandDicon} />
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View>
            <View style={styles.modalView}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                underlayColor="rgba(130, 88, 159,1)"
                style={styles.modalClose}>
                <Text style={styles.closemodaltext}>X</Text>
              </TouchableHighlight>
              <Form>
                <Item style={styles.input}>
                  <Input
                    onChangeText={topic => this.setState({ topic })}
                    onSubmitEditing={event => this.fetchData()}
                    value={this.state.topic}
                    placeholderTextColor="#82589F"
                    placeholder="Search (Powered By GIPHY)"
                  />
                </Item>
              </Form>
              <TouchableHighlight
                underlayColor="rgba(130, 88, 159,1)"
                onPress={() => this.fetchData()}
                style={styles.modalSearch}>
                <Icon style={styles.Icon} name="search" />
              </TouchableHighlight>
            </View>

            <FlatList
              data={this.state.searchResults}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(x, i) => i}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableHighlight onPress={() => this.addGif(item)}>
                  <Image
                    resizeMethod={'auto'}
                    style={styles.Flatlistgif}
                    source={{ uri: item.images.fixed_width_downsampled.webp }}
                  />
                </TouchableHighlight>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  Titleheader: {
    color: '#82589F',
    fontSize: moderateScale(30),
    alignSelf: 'center',
    fontFamily: 'brush script mt kursiv'
  },
  gif: {
    width,
    height: height / 2.5,
    resizeMode: 'cover',
    position: 'absolute'
  },
  boxone: {
    flex: 4,
    width,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  boxtwo: {
    flex: 1,
    width,
    flexDirection: 'row'
  },
  boxthree: {
    flex: 4,
    width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  DandDicon: {
    color: '#82589F',
    fontSize: moderateScale(100),
    margin: 10
  },
  Button: {
    padding: 10,
    margin: 5
  },
  ButtonText: {
    color: '#000',
    fontSize: moderateScale(30)
  },
  signoutButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(15)
  },
  infoView: {
    width,
    flex: 1,
    justifyContent: 'center'
  },
  usernameText: {
    color: '#000',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    padding: 10
  },
  modalClose: {
    padding: 10,
    margin: 5,
    borderRadius: 2
  },
  modalSearch: {
    padding: 10,
    backgroundColor: '#82589F',
    margin: 5,
    borderRadius: 2,
    justifyContent: 'center'
  },
  input: {
    width: width / 1.5
  },
  Flatlistgif: {
    width: width / 2,
    height: height / 4,
    marginVertical: 5,
    marginHorizontal: 3,
    alignSelf: 'center'
  },
  SignoutButton: {
    width: width / 4,
    backgroundColor: '#EF4836',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 5,
    margin: 10
  },
  userGif: {
    backgroundColor: '#82589F',
    width,
    alignSelf: 'center',
    padding: 10,
    margin: 2
  },
  yourgifs: {
    color: '#ffffff',
    fontSize: moderateScale(15),
    textAlign: 'center'
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  closemodaltext: {
    fontSize: moderateScale(20)
  },
  Icon: {
    fontSize: verticalScale(20),
    color: '#ffffff'
  }
});
