import { Injectable, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private appid = "d501e92ea8e61ca515352dfa01e4fc3d";

  public favoritos = [];
  public fobs: BehaviorSubject<any>;

  constructor(public platform: Platform, public httpClient: HttpClient, private storage: Storage, public geolocation: Geolocation, private network: Network) {
    console.log("WeatherService listo");
    this.platform.ready().then(() => {
      this.getFavoritos();
    });

  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  getClimaCiudad(busqueda: string) {

    var url = "https://apiciudades.000webhostapp.com/cities?city=" + busqueda;
    return this.httpClient.get(url);
  }

  getClima(latitud: number, longitud: number) {

    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&lang=es&appid=" + this.appid;
    return this.httpClient.get(url);

  }

  getClimaById(id: number) {

    var url = "https://api.openweathermap.org/data/2.5/weather?id=" + id + "&lang=es&appid=" + this.appid;
    return this.httpClient.get(url);

  }

  pushFavoritos(nuevo: any) {
    this.favoritos.push(nuevo);
    this.storage.set("favoritos", this.favoritos);
  }
  
  removeFavoritos(id: number) {
    
    var index = -1;    
    
    this.favoritos.find((item, i) => {
      if (item.id === id) {
        index = i;
      }
      return true
    });
    
    this.favoritos.splice(index, 1);
    this.storage.set("favoritos", this.favoritos);
    console.log(this.favoritos);

  }

  getFavoritos() {

    return new Promise(resolve => {
      var res: boolean;

      this.storage.get('favoritos').then(async (val) => {

        if (val != null) {
          this.favoritos = val;
        } else {
          this.favoritos = [];
        }

        res = <boolean>await this.actualizarFavoritos();
        resolve(res)
      });
    })
  }

  actualizarFavoritos() {

    return new Promise(resolve => {
      var favoritosAux = [];

      this.favoritos.forEach(el => {

        this.getClimaById(el.id).subscribe((data) => {
          var obj = <any>data;
          el = {
            id: obj.id,
            fecha: this.currentDate(),
            ciudad: obj.name,
            pais: obj.sys.country,
            temp: ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
            temp_min: ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
            temp_max: ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
            humedad: obj.main.humidity,
            icon: "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png",
            descripcion: obj.weather[0].description
          };
          favoritosAux.push(el);
        },
          error => {
            console.log(error)
          });
      });

      setTimeout(() => {
        this.favoritos = favoritosAux;
        this.storage.set("favoritos", this.favoritos);
        this.fobs = new BehaviorSubject(this.favoritos);
        resolve(true)
      }, 1500);
      
    })
  }

  currentDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes();

    return date + " " + time + " hs."
  }


}
