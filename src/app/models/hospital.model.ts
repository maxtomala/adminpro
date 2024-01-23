interface _HospitalUser {
  _id: string;
  nombre: string;
  img: string;
}


export class Hospital {

  constructor(
      public nombre: string,
      public _id?: string,
      public img?: string,
      public usuario?: _HospitalUser,
  ) {}
  //el "_" para indicar que es algo privado,para fines visuales no lo hace realmente privado
  //lo que lo hace privado es que no lo estas exportando

}
