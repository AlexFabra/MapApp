import { Component } from '@angular/core';

interface MenuItem {
  ruta:String;
  nombre:String;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `li{cursor:pointer};`
  ]
})
export class MenuComponent {

  menuItems: MenuItem[] = [
    {
      ruta:'/mapas/fullscreen',
      nombre: 'FullScreen'
    },
    {
      ruta:'/mapas/zoom-range',
      nombre: 'Zoom range'
    },
    {
      ruta:'/mapas/marcadores',
      nombre: 'Marcadores'
    },
    {
      ruta:'/mapas/lugaresDestacados',
      nombre: 'Lugares destacados'
    }
  ]

  constructor() { }

}
