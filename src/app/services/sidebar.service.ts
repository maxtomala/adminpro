import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu:any[]=[
    {
      titulo:'dashboard',
      icono:'mdi mdi-gauge',
      submenu:[
        {titulo:'main',url:'/'},
        {titulo:'Gráficas',url:'grafica1'},
        {titulo:'rxjs',url:'rxjs'},
        {titulo:'promesas',url:'promesas'},
        {titulo:'ProgressBar',url:'progress'},
      ]
    }
    ];
    
    
      constructor() { }
    }