import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { retry, take, map,filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

public intervalSubs: Subscription;

  constructor() {


    // this.retornaObservable().pipe(
    //   retry(0)
    // ).subscribe(
    //   valor => console.log('subs:', valor),
    //   error=> console.warn('error:', error),
    //   ()=> console.info('obs terminado')
    // );

    this.intervalSubs = this.retornaIntevalo().subscribe(console.log)
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }
  retornaIntevalo(): Observable<number> {
    return interval(100)
      .pipe(
        // take(10),
        map(valor => valor + 1),//0=>1
        filter(valor=>(valor%2 ===0)? true: false),
      );
  }
  retornaObservable(): Observable<number> {
    let i = -1

    const obs$ = new Observable<number>(observer => {

      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (i === 2) {
          observer.error('i llego al valor de 2')
        }

      }, 1000)
    });
    return obs$;

  }



}
