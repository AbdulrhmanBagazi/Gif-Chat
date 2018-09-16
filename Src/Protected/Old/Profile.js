import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Alert, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import { Button, Header, Left, Body, Right, Title } from 'native-base';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class Profile extends Component {
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

        <View style={styles.Top}>
          <Text style={styles.Username}>{this.props.store.username}</Text>

          <View style={styles.GifView}>
            <Image style={styles.gif} source={{ uri: this.props.store.Gif }} />
          </View>

          <View style={styles.center}>
            <Button style={styles.moodButton}>
              <Text style={styles.moodtext}>Set Mood GIF</Text>
            </Button>
          </View>
        </View>

        <View style={styles.Bottom}>
          <Button style={styles.Button} onPress={this.logout.bind(this)}>
            <Text style={styles.ButtonText}>Sign Out</Text>
          </Button>
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
  Button: {
    width: width / 2,
    backgroundColor: '#EF4836',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: verticalScale(15)
  },
  Top: {
    flex: 8,
    width,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  Bottom: {
    flex: 1,
    width
  },
  Username: {
    color: '#663399',
    fontSize: scale(15),
    fontFamily: 'PressStart2P-Regular',
    marginTop: 10
  },
  center: {
    backgroundColor: '#663399',
    width,
    height: height / 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
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
  moodButton: {
    width,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#663399'
  },
  moodtext: {
    color: '#ffffff',
    fontSize: scale(15),
    fontFamily: 'PressStart2P-Regular',
    marginTop: 5
  },
  Titleheader: {
    color: '#82589F',
    fontSize: moderateScale(30),
    alignSelf: 'center',
    fontFamily: 'brush script mt kursiv'
  }
});
