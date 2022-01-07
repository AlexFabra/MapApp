import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';

interface colorMarker {
  color: string;
  centro?: [number,number]
  marker?: mapboxgl.Marker;
  name?:string;
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
  .mapa-container{height: 100%; width: 100%;}
  #zoom{background-color: white; border-radius:5px; position:fixed; bottom: 50px; left:50px; padding:10px; z-index:1; width:450px;}
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
export class MarcadoresComponent implements AfterViewInit, OnDestroy {

  //instancia del mapa:
  mapa!:mapboxgl.Map;
  //para tomar la referencia del elemento del html
  @ViewChild('mapa') divMapa!: ElementRef;
  //Array de marcadores
  markers: colorMarker[] = [];

  zoomLevel: number = 15;
  center: [number,number]=[2.7679602230631,42.12509032625227];
  center1: [number,number]=[2.7679602230631,42.12519032625227];
     
  constructor() {
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom:this.zoomLevel
    });
    //event listener para obtener el zoom:
    this.mapa.on('zoom',()=>{this.zoomLevel = this.mapa.getZoom();})
    this.mapa.on('zoomend',()=>{ if(this.mapa.getZoom()>20){this.mapa.zoomTo(20);}})
    this.mapa.on('move', (event)=>{
      const target = event.target;
      //desestructuramos longitud y latitud que está en el objeto:
      const {lng,lat} = target.getCenter();
      this.center=[lng,lat];
    })
    this.readMarkersLocalStorage();
  }

  ngOnDestroy(): void {
    //destruimos los listeners cuando el componente se destruya para que no pueda duplicarse y no perdamos rendimiento:
    this.mapa.off('zoom',()=>{});
    this.mapa.off('zoomend',()=>{});
    this.mapa.off('move',()=>{});
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
      const name = m.name;
      //como getLngLat regresa un objeto, usamos la desestructuración para extraer solo dos propiedades.
      const {lng,lat} = m.marker!.getLngLat();
      lngLatArr.push({color: color, centro: [lng,lat],name})
      })
      //pasamos el objeto a string para guardarlo en el local storage dentro del item markers.
      localStorage.setItem('markers',JSON.stringify(lngLatArr));
  }
  readMarkersLocalStorage(){
    if(!localStorage.getItem('markers')){
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
        color:m.color,
        name:m.name
      })
      //listener para guardar los marcadores cada vez que se acabe
      // de arrastrar uno y así mantener actualizadas las posiciones en el localStorage:
      newMarker.on('dragend',()=>{
        this.saveMarkersLocalStorage()});
    })
  }
  deleteMarker(i:number){
    //borramos el marcador
    this.markers[i].marker?.remove();
    //borramos el lugar del array para el marcador:
    this.markers.splice(i,1);
    //actualizamos el localStorage:
    this.saveMarkersLocalStorage();
  }
  /** comprueva que el marcador tenga nombre
   * @param i posición en el array markers
   * @returns true si tiene nombre
   */
  checkName(i:number): boolean{
    if(this.markers[i].name===undefined){
      return false;
    }
    return true;
  }
  /** añade un nombre al marcador:
   * @param i posición en el array markers
   * @param event nombre escrito por el usuario en el marcador
   */
  addName(i:number, event:any ){
    this.markers[i].name=event.target.value;
    console.log(this.markers[i].name);
    this.saveMarkersLocalStorage();
  }

  zoomIn(){
    this.mapa.zoomIn();
  }
  zoomOut(){
    this.mapa.zoomOut();
  }
  cambioZoomInput(valor:string){
    this.mapa.zoomTo(Number(valor));
  }

}
