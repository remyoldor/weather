import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  private appid = "d501e92ea8e61ca515352dfa01e4fc3d";

  public weather: any;

  public lat: any = "";
  public lon: any = "";
  public timestamp: any = "";

  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient) {
    this.platform.ready().then(() => {
      this.getUbicacion();
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


}
