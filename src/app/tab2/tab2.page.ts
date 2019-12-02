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

    // var b = <boolean>await this.weather.getFavoritos();

    this.weather.getFavoritos().then( (b) => {
      console.log("Devolvio:",b);
      
      this.weather.fobs.subscribe(fav => {
        console.log("Get fobs",fav);
        this.favoritos = fav;
        this.loading = false;
      });
      // this.loading = true;
      console.log("Tab2 actualizar",this.favoritos);
    })
    
  }

  eliminar(id: number) {
    this.weather.removeFavoritos(id)
  }

}
