import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../api/weather.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public busqueda   : string  = ""   ;
  public resultados : any     = ""   ;
  public clima      : any     = ""   ;
  public loading    : boolean = false;
  public selected   : boolean = false;

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService, private storage: Storage) {  }

  onSubmit() {
    this.weather.getUbicaciones(this.busqueda).subscribe((data) => {
      // console.log(data);
      this.resultados = data;
    })
  }

  volver(){
    this.selected = false;
  }

  agregarFavoritos() {
    this.weather.pushFavoritos(this.clima);
  }

  obtenerClima(latitud : number, longitud : number) {
    
    this.clima = this.weather.getTemperatura(latitud, longitud).subscribe((data) => {
      // console.log(data);
      var obj = <any>data;
      this.clima = {
        icon       : "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png",
        ciudad     : obj.name,
        pais       : obj.sys.country,
        temp       : ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_min   : ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_max   : ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        humedad    : obj.main.humidity,
        descripcion: obj.weather[0].description
      };
      console.log(this.clima);
      this.selected = true;
    });
  //  console.log(this.weather.getTemperatura(latitud, longitud));
  }

}
