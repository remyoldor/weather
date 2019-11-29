import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../api/weather.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public loading: boolean = false;

  public local_coords = {};
  public local_clima: any = "";


  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient, public weather: WeatherService, private storage: Storage) {

    this.platform.ready().then(() => {
      
      this.storage.get('local_clima').then((val) => {
        console.log("Data Storage", val);
        if (val != null){
          this.local_clima = val;
        }
        console.log("Local clima", this.local_clima);
      });
      
      console.log("Nueva info");
      this.getUbicacion();
    });

  }

  doRefresh(refresher) {
    
    this.getUbicacion();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.target.complete();
    }, 2000);
  }

  currentDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes();

    return date + " " + time + " hs."
  }

  getUbicacion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.local_coords = {
        lat: resp.coords.latitude,
        lon: resp.coords.longitude
      };
      this.obtenerClima(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Ha ocurrido un error obteniendo la ubicacion: ', error);
    });
  }


  obtenerClima(latitud: number, longitud: number) {
    this.weather.getTemperatura(latitud, longitud).subscribe((data) => {
      // console.log(data);
      var obj = <any>data;
      this.local_clima = {
        icon        : "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png",
        ciudad      : obj.name,
        pais        : obj.sys.country,
        temp        : ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_min    : ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_max    : ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        humedad     : obj.main.humidity,
        descripcion : obj.weather[0].description,
        fecha       : this.currentDate()
      };
      console.log(this.local_clima);
      this.storage.set("local_clima", this.local_clima);
    });

  }
}