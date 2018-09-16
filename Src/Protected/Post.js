import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Keyboard,
  StatusBar
} from 'react-native';
import Dimensions from 'Dimensions';

import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';

import { Header, Item, Input, Button, Form, Label } from 'native-base';

const { width, height } = Dimensions.get('window');
import firebase from 'react-native-firebase';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class Post extends Component {
  // We are setting the initial state of this.state.topic to ''.
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      searchResults: []
    };
  }

  // When the component receives new props (e.g., when the user searches)...
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

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
        var giphyArray = responseData.data;
        this.setState({ searchResults: giphyArray });
      })
      .catch(err => console.log(err));
  }

  addGif(item) {
    const db = firebase.firestore();

    if (this.props.store.username !== '') {
      db
        .collection('Rooms')
        .doc(this.props.listID)
        .collection('Massage')
        .add({
          id: this.props.store.user.uid,
          name: this.props.store.username,
          postGIF: item.images.fixed_width_downsampled.webp,
          Usermood: this.props.store.Gif,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      Actions.pop();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#663399" barStyle="light-content" />

        <View style={styles.CommentsBody}>
          <View style={styles.search}>
            <Button transparent style={styles.backhButton} onPress={() => Actions.pop()}>
              <Icon style={styles.IconBack} name="arrow-left" />
            </Button>
            <Form>
              <Item style={styles.input}>
                <Input
                  onChangeText={topic => this.setState({ topic })}
                  onSubmitEditing={event => this.fetchData()}
                  value={this.state.topic}
                  style={styles.inputText}
                  placeholderTextColor="#663399"
                  placeholder="Search (Powered By GIPHY)"
                />
              </Item>
            </Form>
            <Button style={styles.searchButton} onPress={() => this.fetchData()}>
              <Icon style={styles.Icon} name="search" />
            </Button>
          </View>

          <FlatList
            data={this.state.searchResults}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => this.addGif(item)}>
                <Image resizeMethod={'auto'} style={styles.gif} source={{ uri: item.images.fixed_width_downsampled.webp }} />
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  CommentsBody: {
    width,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  Header: {
    backgroundColor: '#663399'
  },
  gif: {
    width: width / 2,
    height: height / 4,
    marginVertical: 5,
    marginHorizontal: 3,
    alignSelf: 'center'
  },
  search: {
    width,
    height: height / 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  input: {
    width: width / 1.5
  },
  searchButton: {
    width: width / 9,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#663399'
  },
  Icon: {
    fontSize: verticalScale(30),
    fontFamily: 'PressStart2P-Regular',
    color: '#ffffff'
  },
  IconBack: {
    fontSize: verticalScale(30),
    fontFamily: 'PressStart2P-Regular',
    color: '#663399'
  },
  backhButton: {
    width: width / 9,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  Result: {
    fontSize: verticalScale(30),
    fontFamily: 'PressStart2P-Regular',
    color: '#000000'
  }
});
