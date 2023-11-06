import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{
  public titulo!: string;
  public tituloSubs$: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    
    this.tituloSubs$ = this.getArgumetosRuta()
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `adminPro -${titulo}`; // texto de la pestaña de web de chromer     
      });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumetosRuta() {
    return this.router.events
      .pipe(
        filter<any>(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      );


  }

}
