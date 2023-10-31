import { Component, Input } from '@angular/core';
import { ChartEvent, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: []
})
export class DonaComponent {

  @Input() title: string = 'Sin título';
  @Input('labels') doughnutChartLabels: string[] = ['Label', 'Label', 'Label3'];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#9E120E', '#FF58800', '#FFB414'],
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';

  public chartClicked(event: ChartEvent, active: object[]): void {
    console.log(event, active);
  }

  public chartHovered(event: ChartEvent, active: object[]): void {
    console.log(event, active);
  }
}
