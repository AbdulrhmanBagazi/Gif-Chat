import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList, StatusBar, Modal, Keyboard } from 'react-native';

import { Fab } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import { Header, Left, Body, Right, Button, Title, Item, Input, Form, Label } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase
      .firestore()
      .collection('Rooms')
      .doc(this.props.listID)
      .collection('Massage');

    this.unsubscribe = null;
    this.state = {
      getchatGifs: [],
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentWillMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = querySnapshot => {
    const db = firebase.firestore();
    var rooms = [];

    db.collection('Rooms')
      .doc(this.props.listID)
      .collection('Massage')
      .orderBy('timestamp')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          rooms.push({
            list: doc.data()
          });
        });
        this.setState({
          getchatGifs: rooms
        });
        this.props.store.List = this.state.getchatGifs;
      });
  };

  //post
  // When the component receives new props (e.g., when the user searches)...
  componentWillReceiveProps(nextProps) {
    // We will run the fetchData() function with the topic as an argument.
    this.fetchData(nextProps.topic);
  }

  // The fetchData function makes an AJAX call to Giphy API.
  fetchData() {
    Keyboard.dismiss();
    // We pass the topic the user entered in into the URL for the API call.
    fetch(`https://api.giphy.com/v1/gifs/search?q=${this.state.topic}&limit=50&api_key=88pVGgGsktqBi1AJ1mQiPqPGZyxDt4Qu`)
      .then(response => response.json())
      .then(responseData => {
        var giphyArray = responseData.data;
        this.setState({ searchResults: giphyArray });
      })
      .catch(err => console.log(err));
  }

  addGif(item) {
    const db = firebase.firestore();

    if (this.props.store.username !== '') {
      db.collection('Rooms')
        .doc(this.props.listID)
        .collection('Massage')
        .add({
          id: this.props.store.user.uid,
          name: this.props.store.username,
          postGIF: item.images.fixed_width.webp,
          Usermood: this.props.store.Gif,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      this.setModalVisible(!this.state.modalVisible);
    }
  }

  render() {
    console.log(this.state.searchResults);
    return (
      <View style={styles.container}>
        <Header style={styles.Header}>
          <Button transparent style={styles.backhButton} onPress={() => Actions.pop()}>
            <Icon style={styles.IconBack} name="arrow-left" />
          </Button>
          <Body>
            <Title style={styles.Title}>{this.props.listID}</Title>
          </Body>
        </Header>

        <View style={styles.top}>
          <StatusBar backgroundColor="#82589F" barStyle="light-content" />

          <FlatList
            data={this.state.getchatGifs.reverse()}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i}
            inverted
            renderItem={({ item }) => {
              if (item.list.id == this.props.store.user.uid) {
                return (
                  <View style={styles.gifViewUser}>
                    <TouchableHighlight style={styles.PosterNameUser} onPress={() => Actions.UserProfile(item)}>
                      <View>
                        <Text style={styles.PosterNameText}>{item.list.name}</Text>
                      </View>
                    </TouchableHighlight>
                    <Image style={styles.gif} source={{ uri: item.list.postGIF }} />
                  </View>
                );
              } else {
                return (
                  <View style={styles.gifView}>
                    <TouchableHighlight style={styles.PosterName} onPress={() => Actions.UserProfile(item)}>
                      <View>
                        <Text style={styles.PosterNameText}>{item.list.name}</Text>
                      </View>
                    </TouchableHighlight>
                    <Image style={styles.gif} source={{ uri: item.list.postGIF }} />
                  </View>
                );
              }
            }}
          />
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
                  this.setState({ searchResults: [], topic: '' });
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
              initialNumToRender={8}
              style={{ height: height / 1.14 }}
              renderItem={({ item }) => (
                <TouchableHighlight onPress={() => this.addGif(item)}>
                  <Image
                    resizeMethod={'auto'}
                    style={styles.Flatlistgif}
                    source={{
                      uri: item.images.fixed_width.webp
                    }}
                  />
                </TouchableHighlight>
              )}
            />
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.PostButton}
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
          underlayColor="transparent">
          <Icon style={styles.PostButtonText} name="edit" />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  Header: {
    backgroundColor: '#ffffff'
  },
  Title: {
    color: '#82589F',
    fontSize: scale(25),
    fontFamily: 'brush script mt kursiv',
    alignSelf: 'center',
    textAlign: 'center'
  },
  top: {
    width,
    flex: 10
  },
  bottom: {
    width,
    flex: 1
  },
  gif: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  gifView: {
    width,
    height: height / 4,
    marginVertical: 5,
    alignSelf: 'flex-start',
    justifyContent: 'center'
  },
  gifViewUser: {
    width,
    height: height / 4,
    marginVertical: 5,
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  PosterName: {
    backgroundColor: '#663399',
    alignItems: 'flex-start',
    borderTopRightRadius: 5,
    width: width / 2
  },
  PosterNameUser: {
    backgroundColor: '#9A12B3',
    alignItems: 'flex-start',
    borderTopLeftRadius: 5,
    width: width / 2,
    alignSelf: 'flex-end'
  },
  PosterNameText: {
    color: '#ffffff',
    fontSize: scale(15),
    marginLeft: 5
  },
  IconBack: {
    fontSize: scale(20),
    color: '#82589F'
  },
  backhButton: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  closemodaltext: {
    fontSize: moderateScale(20)
  },
  Icon: {
    fontSize: verticalScale(20),
    color: '#ffffff'
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
    marginVertical: 2,
    marginHorizontal: 3
  },
  PostButton: {
    backgroundColor: '#ffffff',
    width,
    alignSelf: 'center',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  PostButtonText: {
    fontSize: moderateScale(23),
    textAlign: 'center',
    color: '#82589F'
  }
});
