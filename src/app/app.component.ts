import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDhBiNm7I3b9tX_g7g0iDvzwEdy9LXV3ZI",
    authDomain: "oraculus5-ale-faef0.firebaseapp.com",
    databaseURL: "https://oraculus5-ale-faef0.firebaseio.com",
    projectId: "oraculus5-ale-faef0",
    storageBucket: "oraculus5-ale-faef0.appspot.com",
    messagingSenderId: "24531287229"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(config);
  }
}
