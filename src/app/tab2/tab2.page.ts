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
  
  actualizar() {
    
    setTimeout(() => {
      this.weather.fobs.subscribe(fav => {
        // console.log("Get fobs",fav);
        this.favoritos = fav;
        this.loading = false;
      });
      console.log("Tab2 actualizar",this.favoritos);
    }, 2000);

  }

  eliminar(id: number) {
    this.weather.removeFavoritos(id)
  }

}
