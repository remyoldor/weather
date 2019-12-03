import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../api/weather.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  public favoritos = [];
  public loading = false;

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService, private storage : Storage) {
    this.loading = true;
    this.platform.ready().then(() => {
      storage.get("favoritos").then((val) => {
        this.favoritos = val;
      });      
      this.actualizar();
    });
    
  }
  
  doRefresh(refresher) {
    this.loading = true;
    this.actualizar();
    refresher.target.complete();
  }
  
  async actualizar() {
    
    // Para que funcione correctamente en la pc, hay que descomentar estas dos lineas
    var conexion = this.weather.isConnected();
    if ((conexion == null) || conexion) {
    //  y comentar esta, el metodo isConnected utiliza Cordova y no está disponible al menos que usara cordova.js o utilizara un emulador. El apk esta compilado con la linea de abajo descomentada.
    // if (this.weather.isConnected()) {

      this.weather.getFavoritos().then( (b) => {
        
        this.weather.fobs.subscribe(fav => {
          this.favoritos = fav;
          this.loading = false;
        });
        console.log("Tab2 actualizar",this.favoritos);
      })
    } else {
      this.loading = false;
    }
      
  }

  eliminar(id: number) {
    this.weather.removeFavoritos(id)
  }

}
