import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../api/weather.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  public favoritos = [];

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService) {
    this.platform.ready().then(() => {

      this.weather.fobs.subscribe(fav => {
        // console.log("Get fobs",fav);
        this.favoritos = fav;
      });

    });
  }

  ngOnInit() {

  }

  onClick() {
    console.log(this.favoritos);
  }

  eliminar(id: number) {
    // alert(id);

    this.weather.removeFavoritos(id)

  }

}
