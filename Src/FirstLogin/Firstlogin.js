import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
import { scale, verticalScale, moderateScale } from '../Config/TextScaling';

import { Button, Icon, Input, Item } from 'native-base';

import { Actions } from 'react-native-router-flux';
import { inject, observer } from 'mobx-react/native';
import firebase from 'react-native-firebase';

@inject('store')
@observer
export default class Username extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  addProfile() {
    const db = firebase.firestore();

    if (this.state.name.length > 1) {
      db
        .collection('Users')
        .doc(this.props.store.user.uid)
        .set({
          name: this.state.name,
          moodGIF: 'https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif'
        });

      this.props.store.username = this.state.name;
      this.props.store.Gif = 'https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif';

      Actions.reset('Protected');
    } else {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Top}>
          <Text style={styles.TitleText}>GIFchat</Text>
        </View>

        <View style={styles.Center}>
          <Text style={styles.Enterusername}>Enter Username</Text>
          <Item style={{ borderColor: '#82589F', width: width / 1.5 }} rounded>
            <Input onChangeText={name => this.setState({ name })} value={this.state.name} placeholder="Rounded Textbox" />
          </Item>
        </View>

        <View style={styles.Bottom}>
          <Button rounded style={styles.NextButton} onPress={() => this.addProfile()}>
            <Icon style={styles.Icon} name="arrow-forward" />
          </Button>
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
  Top: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TitleText: {
    color: '#82589F',
    fontSize: moderateScale(60),
    fontFamily: 'brush script mt kursiv'
  },
  Center: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  Bottom: {
    flex: 1,
    width: width / 1.08,
    justifyContent: 'center'
  },
  NextButton: {
    backgroundColor: '#82589F',
    alignSelf: 'flex-end'
  },
  Icon: {
    fontSize: moderateScale(25)
  },
  Enterusername: {
    color: '#82589F',
    fontSize: moderateScale(25)
  }
});
