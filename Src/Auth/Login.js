import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');

import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Giphy from '../Img/Giphy.png';
import Icon from 'react-native-vector-icons/FontAwesome';

import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  Singin() {
    // Add configuration settings here:
    GoogleSignin.configure(); //latter can add iosClientId for ios
    GoogleSignin.hasPlayServices({ autoResolve: true })
      .then(() => {
        // play services are available. can now configure library
      })
      .catch(err => {
        firebase.fabric.crashlytics().log(error);
        this.setState({
          loading: false
        }); //alret dashborde for me **
      })
      .then(() => {
        GoogleSignin.signIn()
          .then(data => {
            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);

            // login with credential
            firebase.auth().signInAndRetrieveDataWithCredential(credential);
          })
          .catch(err => {
            this.setState({
              loading: false
            }); //later for dashbord firebase analyssi**<--
          })
          .done();
      });
    this.setState({
      loading: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.TitleView}>
          <Text style={styles.TitleText}>GIFchat</Text>
        </View>

        <View style={styles.ButtonView}>
          <Icon name="google-plus" style={styles.googleicon} />
          <TouchableHighlight underlayColor="rgba(130, 88, 159,1)" style={styles.Button} onPress={() => this.Singin()}>
            {this.state.loading ? (
              <ActivityIndicator color="#ffffff" size="small" animating={this.state.loading} />
            ) : (
              <Text style={styles.ButtonText}>Sing In</Text>
            )}
          </TouchableHighlight>
        </View>

        <View style={styles.PowerdView}>
          <Image style={styles.Image} source={Giphy} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  TitleView: {
    backgroundColor: '#82589F',
    flex: 2,
    width: width * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    elevation: 5,
    alignSelf: 'center'
  },
  TitleText: {
    color: '#FFFFFF',
    fontSize: moderateScale(100),
    fontFamily: 'brush script mt kursiv'
  },
  ButtonView: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  Button: {
    backgroundColor: '#82589F',
    padding: 10,
    width: width / 2.5,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5
  },
  ButtonText: {
    color: '#fff',
    fontSize: moderateScale(15)
  },
  PowerdView: {
    flex: 0.25
  },
  Image: {
    width: width / 2,
    alignSelf: 'flex-start',
    resizeMode: 'contain'
  },
  googleicon: {
    color: '#82589F',
    fontSize: moderateScale(25),
    margin: 10
  }
});
