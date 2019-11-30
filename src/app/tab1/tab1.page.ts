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

  public coords = {
    lat: null,
    lon: null
  };
  public clima = {};


  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient, public weather: WeatherService, private storage: Storage) {
    console.log("Tab1 Listo");

    this.platform.ready().then(() => {
      this.loading = true;
      // this.storage.clear("favoritos");
      this.storage.get('clima').then((val) => {
        console.log("Info en storage", val);
        if (val != null) {
          this.clima = val;
        }
      });
      this.getGeolocation();
      this.loading = false;
    });
  }

  doRefresh(refresher) {

    this.getGeolocation();
    setTimeout(() => {
      // console.log('Async operation has ended');
      refresher.target.complete();
    }, 1500);
  }

  currentDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes();

    return date + " " + time + " hs."
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coords = {
        lat: resp.coords.latitude,
        lon: resp.coords.longitude
      };
      this.obtenerClima();
    }).catch((error) => {
      console.log('Ha ocurrido un error obteniendo la ubicacion: ', error);
    });
  }


  obtenerClima() {
    this.weather.getClima(this.coords.lat, this.coords.lon).subscribe((data) => {
      // console.log(data);
      var obj = <any>data;
      this.clima = {
        fecha: this.currentDate(),
        ciudad: obj.name,
        pais: obj.sys.country,
        temp: ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_min: ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_max: ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        humedad: obj.main.humidity,
        descripcion: obj.weather[0].description,
        icon: "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png"
      };
      console.log(this.clima);
      this.storage.set("clima", this.clima);
    });

  }
}