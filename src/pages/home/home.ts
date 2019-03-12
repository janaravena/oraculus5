
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('mapa') mapaElement: ElementRef;
  map: any;

  markers = [];
  
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device) {

      platform.ready().then(() => {
        this.initMap();
      });

  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let miPosicionInicial = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.map = new google.maps.Map(this.mapaElement.nativeElement, {
        zoom: 15,
        center: miPosicionInicial
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      let miPosicionActual = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      this.addMarker(miPosicionActual);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: {
        url: 'assets/logo.png',
        size: new google.maps.Size(126, 75),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 8),
        scaledSize: new google.maps.Size(32, 19)
      },
      //title: 'Identificador',
			//animation: 'DROP',
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

}
