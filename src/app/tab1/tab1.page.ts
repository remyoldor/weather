import { Component, APP_ID } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private appid = "d501e92ea8e61ca515352dfa01e4fc3d";
  public loading: boolean = true;

  public latitud    : any = ""   ;
  public longitud   : any = ""   ;
  public ciudad     : string = "";
  public icon       : any = ""   ;
  public temperatura: string = "";
  public temp_max   : string = "";
  public temp_min   : string = "";
  public humedad    : number     ;
  public descripcion: string = "";
  public timestamp  : any = ""   ;
  public type       : any = ""   ;


  constructor(public platform: Platform, public geolocation: Geolocation, public httpClient: HttpClient) {

    this.platform.ready().then(() => {
      this.getUbicacion();
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
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      this.getTemperatura(this.latitud, this.longitud);
    }).catch((error) => {
      console.log('Ha ocurrido un error obteniendo la ubicacion: ', error);
    });
  }
  
  getTemperatura(latitud, longitud) {
    
    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&lang=es&appid=" + this.appid;

    this.httpClient.get(url).subscribe((data) => {
      console.log(data);
      var obj = <any>data;
      this.ciudad = obj.name;
      this.type = obj.weather[0].main;
      // this.icon = "https://openweathermap.org/img/w/" + obj.weather[0].icon+".png";
      this.icon = "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png";
      this.temperatura = ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
      this.temp_max = ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
      this.temp_min = ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º";
      this.descripcion = obj.weather[0].description;
      this.humedad = obj.main.humidity;
    })
  }

}
