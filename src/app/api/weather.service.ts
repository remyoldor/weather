import { Injectable, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private appid = "d501e92ea8e61ca515352dfa01e4fc3d";

  public lat: any = "";
  public lon: any = "";
  public favoritos = [];
  public fobs: BehaviorSubject<any>;

  constructor(public platform: Platform, public httpClient: HttpClient, private storage: Storage, public geolocation: Geolocation) {
    console.log("Servicio listo");
    this.platform.ready().then(() => {
      this.getFavoritos();
    });

  }

  getClimaCiudad(busqueda: string) {

    var url = "https://apiciudades.000webhostapp.com/cities?city=" + busqueda;
    return this.httpClient.get(url);
  }

  getClima(latitud: number, longitud: number) {

    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&lang=es&appid=" + this.appid;
    return this.httpClient.get(url);

  }

  pushFavoritos(nuevo: any) {
    // console.log(this.favoritos);
    this.favoritos.push(nuevo);
    this.storage.set("favoritos", this.favoritos);
  }

  removeFavoritos(id : number) {
    console.log("Se borrara con el id: ", id);
    // this.favoritos.find(f => f.id === id);
    // this.storage.set("favoritos", this.favoritos);

    this.favoritos = this.favoritos.filter(function (el) {
      if (el.id === id) {
        return false;
      }
      return true;
    });

    console.log("Resultado", this.favoritos);
    
  }

  getFavoritos() {

    this.storage.get('favoritos').then((val) => {
      
      console.log("Get favoritos before:", val);
      if (val != null) {
        this.favoritos = val;
      } else {
        this.favoritos = [];
      }
      console.log("Get favoritos after:", val);
      
      this.fobs = new BehaviorSubject(this.favoritos)
      console.log("Get fobs:", this.fobs);

    });
  }


}
