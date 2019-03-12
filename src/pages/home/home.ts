
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

import * as firebase from 'Firebase';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('mapa') mapaElement: ElementRef;
  map: any;

  markers = [];
  ref = firebase.database().ref('geolocations/');
  
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device) {

      platform.ready().then(() => {
        this.initMap();
      });

      this.ref.on('value', resp => {
        this.deleteMarkers();
        snapshotToArray(resp).forEach(data => {
          if(data.uuid !== this.device.uuid) {
            let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
            let imagen = 'assets/logo2.png';
            this.addMarker(updatelocation, imagen);
            this.setMapOnAll(this.map);
          } else {
           
            let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
            let imagen = 'assets/imgs/logo.png';
            this.addMarker(updatelocation, imagen);
            this.setMapOnAll(this.map);
          }
        });
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
      this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
      let miPosicionActual = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let imagen = 'assets/imgs/logo.png';
      this.addMarker(miPosicionActual, imagen);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location, urlImage) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: {
        url: urlImage,
        size: new google.maps.Size(126, 75),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 8),
        scaledSize: new google.maps.Size(32, 19)
      },
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

  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('miLlave')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('miLlave')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('miLlave', newData.key);
    }
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};


