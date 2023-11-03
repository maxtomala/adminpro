import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
    // Aquí puedes agregar estilos CSS específicos para este componente si es necesario.
  ]
})
export class AccountSettingsComponent implements OnInit {
  public linkTheme: HTMLLinkElement | null | undefined;

  ngOnInit() {
    this.linkTheme = document.querySelector('#theme') as HTMLLinkElement;

    if (this.linkTheme) {
      const theme = localStorage.getItem('theme');
      if (theme) {
        this.changeTheme(theme);
      }
    }
  }

  changeTheme(theme: string) {
    if (this.linkTheme) {
      const url = `./assets/css/colors/${theme}.css`;
      this.linkTheme.setAttribute('href', url);
      localStorage.setItem('theme', url);
    }
  }
}

// changeTheme(theme:string){
//   const linkTheme = document.querySelector('#theme')
//   const url=`./assets/css/colors/${theme}.css`;

// linkTheme.setAttribute('href',url);
// }
