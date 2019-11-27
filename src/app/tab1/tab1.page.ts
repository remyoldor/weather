import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../api/weather.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public loading: boolean = false;

  public lat: any = "";
  public lon: any = "";
  public clima: any = "";


  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient, public weather: WeatherService) {

    this.platform.ready().then(() => {
      this.getUbicacion();
      // console.log("Servicio devuelve: " + weather.getUbicacion());
    });

  }

  doRefresh(event) {
    try {
      this.getUbicacion();
      event.target.complete();
    } catch (error) {
      console.log("Ha ocurrido un error al actualizar.")
    }
  }

  getUbicacion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
      this.obtenerClima(this.lat, this.lon);
    }).catch((error) => {
      console.log('Ha ocurrido un error obteniendo la ubicacion: ', error);
    });
  }


  obtenerClima(latitud : number, longitud : number) {
    this.weather.getTemperatura(latitud, longitud).subscribe((data) => {
      // console.log(data);
      var obj = <any>data;
      this.clima = {
        icon        : "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png",
        ciudad      : obj.name,
        pais        : obj.sys.country,
        temp        : ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_min    : ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_max    : ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        humedad     : obj.main.humidity,
        descripcion : obj.weather[0].description,
        timestamp   : obj.dt
      };
      console.log(this.clima);

    });

  }

  // getTemperatura(latitud, longitud) {

  //   var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&lang=es&appid=" + this.appid;

  //   this.httpClient.get(url).subscribe((data) => {
  //     console.log(data);
  //     var obj = <any>data;
  //     this.ciudad = obj.name;
  //     this.type = obj.weather[0].main;
  //     // this.icon = "https://openweathermap.org/img/w/" + obj.weather[0].icon+".png";
  //     this.icon = "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png";
  //     this.temperatura = ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
  //     this.temp_max = ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
  //     this.temp_min = ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
  //     this.descripcion = obj.weather[0].description;
  //     this.humedad = obj.main.humidity;
  //   })
  // }
}