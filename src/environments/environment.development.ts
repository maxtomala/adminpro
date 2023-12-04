// TODO: Cambiar el url de los servicios en prod

export const environment = {
    production: true,
    base_url: 'http://localhost:3000/api'
  };


//  posiblemnte este seria mas optimizado el  código al máximo
// export const environment = {
//     production: false,
//     url_services: 'http://localhost:3000'
//   };



//  junto con el: usuario.service.ts

// import { environment } from 'src/environments/environment';
// createUser(usuario: Usuario) {
//   let url = environment.url_services+'/login/...';