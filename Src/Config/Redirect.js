import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Giphy from '../Img/Giphytwo.png';
import { inject, observer } from 'mobx-react/native';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
@inject('store')
@observer
export default class Redirect extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        const db = firebase.firestore();
        const docRef = db.collection('Users').doc(user.uid);

        // User is signed in.
        this.props.store.user = user._user;

        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();

              this.props.store.username = data.name;
              this.props.store.Gif = data.moodGIF;
              this.props.store.user = user._user;

              Actions.reset('Protected');
            } else {
              Actions.reset('FirstTime');
            }
          })
          .catch(function(error) {});
      } else {
        // No user is signed in.
        Actions.reset('Auth');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Top}>
          <Text style={styles.TitleText}>GIFchat</Text>
        </View>
        <View style={styles.Bottom}>
          <Image style={styles.Image} source={Giphy} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  Top: {
    flex: 3,
    justifyContent: 'center'
  },
  Bottom: {
    flex: 1
  },
  TitleText: {
    color: '#82589F',
    fontSize: moderateScale(100),
    fontFamily: 'brush script mt kursiv'
  },
  Image: {
    width: width / 3,
    resizeMode: 'contain'
  }
});
