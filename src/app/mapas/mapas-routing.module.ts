import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullScreenComponent } from './pages/full-screen/full-screen.component';
import { ZoomRangeComponent } from './pages/zoom-range/zoom-range.component';
import { MarcadoresComponent } from './pages/marcadores/marcadores.component';
import { LugaresDestacadosComponent } from './pages/propiedades/lugaresDestacados.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {path:'fullscreen', component: FullScreenComponent},
      {path:'zoom-range', component: ZoomRangeComponent},
      {path:'marcadores', component: MarcadoresComponent},
      {path:'lugaresDestacados', component: LugaresDestacadosComponent},
      {path:'**', redirectTo: 'fullscreen'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapasRoutingModule { }
