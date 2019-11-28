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

  public favoritos  = [];

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService, private storage: Storage) {
    this.platform.ready().then(() => {

      this.weather.fobs.subscribe( fav => {
        console.log("Get fobs",fav);
        this.favoritos = fav;
      });
      
    });
  }

  onClick(){
    console.log(this.favoritos);
  }

}
