import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapasRoutingModule } from './mapas-routing.module';
import { MiniMapaComponent } from './components/mini-mapa/mini-mapa.component';
import { FullScreenComponent } from './pages/full-screen/full-screen.component';
import { MarcadoresComponent } from './pages/marcadores/marcadores.component';
import { ZoomRangeComponent } from './pages/zoom-range/zoom-range.component';
import { LugaresDestacadosComponent } from './pages/propiedades/lugaresDestacados.component';


@NgModule({
  declarations: [
    MiniMapaComponent,
    FullScreenComponent,
    MarcadoresComponent,
    ZoomRangeComponent,
    LugaresDestacadosComponent
],
  imports: [
    CommonModule,
    MapasRoutingModule
  ]
})
export class MapasModule { }
