import { Component, OnInit } from '@angular/core';
declare function customInitFunctions():void;


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
    // importante no borrar es la funcion  para cargar la pag
    customInitFunctions();
    
  }
  
}


// Accede al elemento con ID "theme" después de que el DOM se haya cargado
const linkTheme = document.querySelector('#theme') as HTMLLinkElement;

if (linkTheme) {
  // Recupera la configuración del tema desde el localStorage
  const storedTheme = localStorage.getItem('theme');
  
  // Si hay una configuración de tema almacenada, úsala, de lo contrario, usa un valor predeterminado
  const url = storedTheme || './assets/css/colors/purple-dark.css';
  linkTheme.setAttribute('href', url);

}



// constructor() { }

// ngOnInit(): void {
//   // Accede al elemento con ID "theme" después de que el DOM se haya cargado
//   const linkTheme = document.querySelector('#theme') as HTMLLinkElement;

//   if (linkTheme) {
//     const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
//     linkTheme.setAttribute('href', url);
//   }
// }















// public linkTheme = document.querySelector('#theme');

// constructor() { }

// ngOnInit(): void {
//   const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
//   this.linkTheme.setAttribute('href', url);

// }
