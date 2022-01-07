import { Component } from '@angular/core';

interface Propiedad {
  titulo: string;
  descripcion: string;
  lngLat: [number, number];
}

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styles: [
  ]
})
export class PropiedadesComponent {

  propiedades: Propiedad[] = [
    {
      titulo: 'Les Estunes, Porqueres/Girona',
      descripcion: 'Reserva natural',
      lngLat: [ 2.7461490983838117,42.11350571779783 ]
    },
    {
      titulo: 'Bosc de Can Morgat, Porqueres/Girona',
      descripcion: 'Refugio de vida salvaje',
      lngLat: [ 2.7496908740989645,42.13342505387283 ]
    },
    {
      titulo: 'Bosc de Can Puig, Banyoles/Girona',
      descripcion: 'Parque',
      lngLat: [ 2.777546155752192,42.12415172308415 ]
    },
    {
      titulo: 'Estanyol den Sisó, Banyoles/Girona',
      descripcion: 'Reserva natural',
      lngLat: [ 2.752806111445631,42.1275940614373 ]
    },
  ]
}
