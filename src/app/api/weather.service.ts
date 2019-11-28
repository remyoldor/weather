import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  private appid = "d501e92ea8e61ca515352dfa01e4fc3d";

  public weather: any;

  public lat: any = "";
  public lon: any = "";
  public timestamp: any = "";
  public fobs: BehaviorSubject<any>;
  public favoritos = [];

  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient, private storage: Storage) {
    this.platform.ready().then(() => {

      // this.getUbicacion();
      this.getFavoritos();

    });
   }

  getUbicacion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
      this.getTemperatura(this.lat, this.lon);
    }).catch((error) => {
      console.log('Ha ocurrido un error obteniendo la ubicacion: ', error);
    });
  }

  getUbicaciones(busqueda : string) {

    console.log(busqueda)

    var url = "https://apiciudades.000webhostapp.com/cities?city=" + busqueda;
    return this.httpClient.get(url);
  }
  
  getTemperatura(latitud : number, longitud : number) {
    
    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&lang=es&appid=" + this.appid;
    return this.httpClient.get(url);
    
  }

  pushFavoritos(nuevo: any) {
    console.log(this.favoritos);
    
    this.favoritos.push(nuevo);
    this.storage.set("favoritos",this.favoritos );
  }
  
  getFavoritos () {
    this.storage.get('favoritos').then((val) => {
      console.log("Get favoritos:",val);
      if (val != null) {
        this.favoritos = val;
      }
    });
    this.fobs = new BehaviorSubject(this.favoritos);
  }


}
