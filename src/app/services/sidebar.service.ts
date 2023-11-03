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
        {titulo:'ProgressBar',url:'progress'},
        {titulo:'Gráficas',url:'grafica1'},
      ]
    }
    ];
    
    
      constructor() { }
    }