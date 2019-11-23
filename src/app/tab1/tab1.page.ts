import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public latitud: any = "";
  public longitud: any = "";
  public timestamp: any = "";

  public ciudad: string = "";
  public temperatura: string = "";

  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient) {

    this.platform.ready().then(() =>{

      this.getUbicacion();
  
      let watch = geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitud
        // data.coords.longitud
      });

    });

   }

   getUbicacion (){
     this.geolocation.getCurrentPosition().then((resp) => {
       this.latitud = resp.coords.latitude;
       this.longitud = resp.coords.longitude;
       console.log('Mi latitud: ', resp.coords.latitude);
       console.log('My longitud: ', resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
   }

   getTemperatura(){
     
   }

}
