
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [ '.row{background-color: white; border-radius:5px; position:fixed; bottom: 50px; left:50px; padding:10px; z-index:1;}'
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  constructor() { }

  ngOnDestroy(): void {
    //destruimos los listeners cuando el componente se destruya para que no pueda duplicarse y no perdamos rendimiento:
    this.mapa.off('zoom',()=>{});
    this.mapa.off('zoomend',()=>{});
    this.mapa.off('move',()=>{});
  }

  mapa!:mapboxgl.Map;
  @ViewChild('mapa') divMapa!: ElementRef;
  zoomLevel: number = 17;
  center: [number,number]=[2.7579602230631,42.13509032625227];

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
