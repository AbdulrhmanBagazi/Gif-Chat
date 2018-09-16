import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import { Header, Left, Body, Right, Button, Title } from 'native-base';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class UserProfile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.Header}>
          <Button transparent style={styles.backhButton} onPress={() => Actions.pop()}>
            <Icon style={styles.IconBack} name="arrow-left" />
          </Button>
          <Body>
            <Title style={styles.Username}>{this.props.list.name}</Title>
          </Body>
        </Header>
        <StatusBar backgroundColor="#82589F" barStyle="light-content" />

        <View style={styles.Top}>
          <Text style={styles.Moodtext}>Mood</Text>

          <View style={styles.GifView}>
            <Image style={styles.gif} source={{ uri: this.props.list.Usermood }} />
          </View>
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
  Header: {
    backgroundColor: '#ffffff'
  },
  Top: {
    flex: 1,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#82589F'
  },
  Username: {
    color: '#82589F',
    fontSize: scale(20),
    alignSelf: 'center',
    textAlign: 'center'
  },
  center: {
    backgroundColor: '#663399',
    width,
    height: height / 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  gif: {
    width: width / 1.05,
    height: height / 2,
    alignSelf: 'center'
  },
  GifView: {
    borderColor: '#663399',
    borderWidth: 1
  },
  Moodtext: {
    color: '#ffffff',
    fontSize: scale(30),
    fontFamily: 'brush script mt kursiv'
  },
  backhButton: {
    width: width / 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  IconBack: {
    fontSize: scale(20),
    color: '#82589F'
  }
});
