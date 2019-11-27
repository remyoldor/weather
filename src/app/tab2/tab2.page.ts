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

  public fav  = [];

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService) {
    this.platform.ready().then(() => {
      // console.log(this.fav);
      this.weather.favoritos.subscribe( fav => {
        this.fav = fav;
      });
    });
  }

  ngOnInit() {
  }

  onClick(){
    console.log(this.fav);
    
  }

}
