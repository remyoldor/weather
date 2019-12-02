import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../api/weather.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public loading: boolean = true;

  public coords = {
    lat: null,
    lon: null
  };
  public clima = {};


  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient, public weather: WeatherService, private storage: Storage, public toastController: ToastController) {
    console.log("Tab1 Listo");

    this.platform.ready().then(async () => {
      // this.storage.remove("favoritos");
      this.storage.get('clima').then((val) => {
        if (val != null) {
          this.clima = val;
        }
      });
      this.doRefresh(null);
    });

  }

  async doRefresh(refresher) {

    await this.getGeolocation().then((res) => {
      if (res) {
        this.obtenerClima();
      }
    }).finally(() => {
      if (refresher != null) {
        refresher.target.complete();
      }
      this.loading = false;
    });

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: 'dark',
      // header: 'No se pudo obtener la ubicación.',
      position: 'top',
      duration: 2000,
      buttons: [
        {
          side: 'start',
          icon: 'locate',
        }
      ]
    });
    toast.present();
  }

  currentDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes();

    return date + " " + time + " hs."
  }

  getGeolocation() {

    return new Promise(resolve => {
      this.geolocation.getCurrentPosition({ timeout: 5000, enableHighAccuracy: true }).then((resp) => {
        this.coords = {
          lat: resp.coords.latitude,
          lon: resp.coords.longitude
        };
        resolve(true)
      }).catch(() => {
        this.presentToast('La señal de GPS no esta disponible.');
        resolve(false)
      });
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
      console.log("Informacion clima local actualizada: ", this.clima);
      this.loading = false;
      this.storage.set("clima", this.clima);
    });

  }
}