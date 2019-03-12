
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('mapa') mapaElement: ElementRef;
  map: any;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation) {

      platform.ready().then(() => {
        this.initMap();
      });

  }

  initMap() {
    this.map = new google.maps.Map(this.mapaElement.nativeElement, {
      zoom: 13,
      center: {
        lat: -33.4378886, 
        lng: -70.6526897
      }
    });
  }

}
