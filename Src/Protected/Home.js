import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import { Actions } from 'react-native-router-flux';
import { action } from 'mobx';
import { Button, Header, Left, Body, Right, Title } from 'native-base';

import { inject, observer } from 'mobx-react/native';
import firebase from 'react-native-firebase';

@inject('store')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Rooms');
    this.unsubscribe = null;

    this.state = {
      Chatrooms: []
    };
  }

  componentWillMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    const db = firebase.firestore();
    var rooms = [];

    db.collection('Rooms')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          rooms.push({
            list: doc.data(),
            listID: doc.id
          });
        });
        this.setState({
          Chatrooms: rooms
        });
        this.props.store.List = this.state.Chatrooms;
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#ffffff' }}>
          <Body>
            <Text style={styles.TitleText}>GIFchat</Text>
          </Body>
        </Header>

        <StatusBar backgroundColor="#82589F" barStyle="light-content" />

        <View style={styles.center}>
          <FlatList
            data={this.state.Chatrooms}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i}
            renderItem={({ item }) => (
              <TouchableHighlight
                style={styles.TouchableHighlight}
                onPress={() => Actions.Chat(item)}
                underlayColor="#ffffff">
                <Text style={styles.TouchableHighlightText}> {item.listID} </Text>
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
    backgroundColor: '#ffffff'
  },
  TouchableHighlight: {
    backgroundColor: '#ffffff',
    width: width / 1.05,
    height: height / 8,
    borderRadius: 5,
    elevation: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#663399',
    justifyContent: 'center'
  },
  center: {
    width,
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TouchableHighlightText: {
    color: '#663399',
    fontSize: scale(20),
    textAlign: 'center'
  },
  Addchat: {
    backgroundColor: 'transparent',
    flex: 1
  },
  Addbutton: {
    width,
    flex: 1,
    justifyContent: 'center'
  },
  powerd: {
    width,
    flex: 0.5,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  TitleText: {
    color: '#82589F',
    fontSize: moderateScale(30),
    fontFamily: 'brush script mt kursiv',
    alignSelf: 'center',
    textAlign: 'center'
  }
});
