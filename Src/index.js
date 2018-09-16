import React, { Component } from 'react';
import { Router, Scene, Lightbox } from 'react-native-router-flux';
import { Provider } from 'mobx-react/native';
import store from './Config/Mobx';
//Auth
import Login from './Auth/Login';

//Protected
import Home from './Protected/Home';
import Profile from './Protected/Profile';
import Chat from './Protected/Chat';
import Post from './Protected/Post';
import UserProfile from './Protected/UserProfile';
//Config
import Redirect from './Config/Redirect';

//firstlogin
import Firstlogin from './FirstLogin/Firstlogin';

import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from './Config/TextScaling';

const Tab1 = ({ focused, title }) => {
  return (
    <Icon
      name="home"
      style={{ color: focused ? '#82589F' : '#BEBEBE', fontSize: focused ? moderateScale(25) : moderateScale(15) }}
    />
  );
};

const Tab2 = ({ focused, title }) => {
  return (
    <Icon
      name="user"
      style={{ color: focused ? '#82589F' : '#BEBEBE', fontSize: focused ? moderateScale(25) : moderateScale(15) }}
    />
  );
};

export default class index extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="all">
            <Scene key="Direct">
              <Scene key="Redirect" component={Redirect} hideNavBar={true} initial />
            </Scene>

            <Scene key="Auth">
              <Scene key="Login" component={Login} hideNavBar={true} initial />
            </Scene>

            <Scene key="FirstTime">
              <Scene key="Firstlogin" component={Firstlogin} hideNavBar={true} initial />
            </Scene>

            <Scene key="Protected">
              <Scene
                key="tabbar"
                tabs={true}
                tabBarStyle={{ backgroundColor: '#ffffff' }}
                tabBarPosition={'bottom'}
                showLabel={false}
                initial>
                <Scene key="Tabone" icon={Tab1} hideNavBar>
                  <Scene key="Home" component={Home} initial />
                </Scene>

                <Scene key="Tabtwo" icon={Tab2} hideNavBar>
                  <Scene key="Profile" component={Profile} />
                </Scene>
              </Scene>
              <Scene key="Chat" component={Chat} hideNavBar />
              <Scene key="Post" component={Post} hideNavBar />
              <Scene key="UserProfile" component={UserProfile} hideNavBar />
            </Scene>
          </Scene>
        </Router>
      </Provider>
    );
  }
}
