import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface colorMarker {
  color: string;
  centro?: [number,number]
  marker?: mapboxgl.Marker;
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
  .mapa-container{height: 100%; width: 100%;}
  .list-group{
    position:fixed;
    top:20px;
    right:20px;
    z-index:1;
  }
  li{cursor:pointer;}
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  //instancia del mapa:
  mapa!:mapboxgl.Map;
  //para tomar la referencia del elemento del html
  @ViewChild('mapa') divMapa!: ElementRef;
  //Array de marcadores
  markers: colorMarker[] = [];

  zoomLevel: number = 15;
  center: [number,number]=[2.7679602230631,42.12509032625227];
  center1: [number,number]=[2.7679602230631,42.12519032625227];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom:this.zoomLevel
      });

      const markerHtml: HTMLElement = document.createElement('div');
      markerHtml.innerHTML='Mi casa'
      //creación de marcador:
      const marker = new mapboxgl.Marker()
      .setLngLat(this.center).addTo(this.mapa);
      const marker1 = new mapboxgl.Marker({element:markerHtml})
      .setLngLat(this.center1).addTo(this.mapa);

      this.readMarkersLocalStorage();
  }

  createMarker(){
    //creamos un color aleatorio para el nuevo marcador:
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    //este marcador es arrastrable:
    const  newMarker = new mapboxgl.Marker({draggable:true,color})
    .setLngLat(this.center)
    .addTo(this.mapa);
    //guardamos el nuevo marcador en el array:
    this.markers.push({color, marker: newMarker});
    this.saveMarkersLocalStorage();
    //listener para guardar los marcadores cada vez que se acabe
    // de arrastrar uno y así mantener actualizadas las posiciones en el localStorage:
    newMarker.on('dragend',()=>{
      this.saveMarkersLocalStorage()});
  }

  /**Centra en pantalla el marcador que se pasa por parámetro,
   * desplazándose de manera natural.
   * @param marker con interfaz colorMarker
   */
  goToMarker(marker:colorMarker){
    this.mapa.flyTo({center:marker.marker!.getLngLat()})
  }
  /**Crea un array de objetos con interfaz colorMarker, 
   * guarda en ella los marcadores con su posición
   * y envia los datos al localStorage.
   */
  saveMarkersLocalStorage(){
    const lngLatArr:colorMarker[]=[];

    this.markers.forEach(m=>{
      const color = m.color;
      //como getLngLat regresa un objeto, usamos la desestructuración para extraer solo dos propiedades.
      const {lng,lat} = m.marker!.getLngLat();
      lngLatArr.push({color: color, centro: [lng,lat]})
      })
      //pasamos el objeto a string para guardarlo en el local storage dentro del item markers.
      localStorage.setItem('markers',JSON.stringify(lngLatArr));
  }
  readMarkersLocalStorage(){
    if(!localStorage.getItem('markers')){
      console.log('halo');
      return;
    }
    const lngLatArr: colorMarker[] = JSON.parse(localStorage.getItem('markers')!);

    lngLatArr.forEach(m=>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa);

      this.markers.push({
        marker:newMarker,
        color:m.color
      })
      //listener para guardar los marcadores cada vez que se acabe
      // de arrastrar uno y así mantener actualizadas las posiciones en el localStorage:
      newMarker.on('dragend',()=>{
        this.saveMarkersLocalStorage()});
    })
  }
  borrarMarcador(i:number){
    //borramos el marcador
    this.markers[i].marker?.remove();
    //borramos el lugar del array para el marcador:
    this.markers.splice(i,1);
    //actualizamos el localStorage:
    this.saveMarkersLocalStorage();
  }
}
