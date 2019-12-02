import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../api/weather.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';


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
  public favClick   : boolean = false;

  constructor(public platform: Platform, public httpClient: HttpClient, private weather: WeatherService, private storage: Storage, public toastController: ToastController) {
    // weather.getFavoritos();
   }

  onSubmit() {
    this.loading = true;
    this.weather.getClimaCiudad(this.busqueda).subscribe((data) => {
      this.resultados = data;
      this.loading = false;
    })
  }

  volver() {
    this.selected = false;
    this.favClick = false;
  }

  borrar(){
    this.busqueda = "";
    this.resultados = null;
  }

  agregarFavoritos() {
    this.favClick = true;
    this.presentToast(this.clima.ciudad + " se ha añadido a favoritos.")
    this.weather.pushFavoritos(this.clima);
  }

  obtenerClima(latitud: number, longitud: number) {
    this.loading = true;
    this.clima = this.weather.getClima(latitud, longitud).subscribe((data) => {
      console.log("Response api:", data);
      var obj = <any>data;
      this.clima = {
        id         : obj.id,
        fecha      : this.currentDate(),
        ciudad     : obj.name,
        pais       : obj.sys.country,
        temp       : ((parseFloat(obj.main.temp) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_min   : ((parseFloat(obj.main.temp_min) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        temp_max   : ((parseFloat(obj.main.temp_max) - 273.15).toFixed(2)).toString().split(".")[0] + "º",
        humedad    : obj.main.humidity,
        icon       : "/assets/img/png/" + obj.weather[0].icon.slice(0, 3) + ".png",
        descripcion: obj.weather[0].description
      };
      console.log(this.clima);
      this.loading = false;
      this.selected = true;
    },
      error => {
        console.log(error)
      });
  }

  currentDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes();

    return date + " " + time + " hs."
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: 'dark',
      position: 'top',
      duration: 2000,
      buttons: [
        {
          side: 'start',
          icon: 'heart',
        }
      ]
    });
    toast.present();
  }

}
