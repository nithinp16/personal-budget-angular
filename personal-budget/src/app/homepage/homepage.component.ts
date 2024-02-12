import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

import { DataService } from '../data.service';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{

    public dataSource: any;
    public chart: any;
    public svg: any;
    public pie: any;

    constructor( private http: HttpClient, private dataService: DataService ){}

    ngOnInit(): void {
        setTimeout(() => {
            this.dataSource = this.dataService.dataSource;
            this.createPieChart();
            this.createD3Chart();
          }, 1000);
    }

    createPieChart() {
        var ctx = document.getElementById('myChart') as HTMLCanvasElement;
        if( typeof ctx !== 'undefined' ){
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: this.dataSource
            });
        }
    }

    private getData() {
        const arr = [];
        const labels = this.dataSource.labels;
        for (let i = 0; i < this.dataSource.datasets[0].data.length; i++) {
            arr.push({
                label: labels[i],
                value: this.dataSource.datasets[0].data[i],
            });
        }
        return arr;
    }

    private midAngle(d: { startAngle: number; endAngle: number; }) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    createD3Chart(){
        const width = 600;
        const height = 300;
        this.svg = d3.select('svg')
               .attr('width', width)
               .attr('height', height)
               .append('g')
               .attr('transform', 'translate(' + width / 2 + ',' +
                height / 2 + ')');

        let radius = Math.min(width, height) / 2 ;
        
        let color = d3.scaleOrdinal()
            .domain(this.dataSource.labels)
           .range(['#ffcd56',
           '#ff6384',
           '#36a2eb',
           '#fd6b19',
           '#09ee09',
           '#3366cc',
           '#00ff67',"#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        this.pie = d3.pie()
        .sort(null)
                   .value((d: any) => d.value);
        let dataReady = this.pie(this.getData());

        let arc = d3.arc()
                   .innerRadius(radius * 0.4)
                   .outerRadius(radius * 0.8);
        let outerArc = d3.arc()
                   .innerRadius(radius * 0.9)
                   .outerRadius(radius * 0.9);
                   this.svg
                   .selectAll('allSlices')
                   .data(dataReady)
                   .enter()
                   .append('path')
                   .attr('d', arc)
                   .attr('fill', (d:any) => (color(d.data.label)))
                   .attr('stroke', 'white')
                   .style('stroke-width', '2px')
                   .style('opacity', 0.7);
        this.svg
                   .selectAll('allPolylines')
                   .data(dataReady)
                   .enter()
                   .append('polyline')
                     .attr('stroke', 'black')
                     .style('fill', 'none')
                     .attr('stroke-width', 1)
                     .attr('points', (d:any) => {
                         const posA = arc.centroid(d);
                         const posB = outerArc.centroid(d);
                         const posC = outerArc.centroid(d);
                         posC[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
                         return [posA, posB, posC];
                       });
                       this.svg
                       .selectAll('allLabels')
                       .data(dataReady)
                       .enter()
                       .append('text')
                         .text( (d:any) => { console.log(d.data.label); return d.data.label; } )
                         .attr('transform', (d:any) => {
                             const pos = outerArc.centroid(d);
                             pos[0] = radius * 0.99 * (this.midAngle(d) < Math.PI ? 1 : -1);
                             return 'translate(' + pos + ')';
                           })
                         .style('text-anchor', (d:any) => {
                             return (this.midAngle(d) < Math.PI ? 'start' : 'end');
                           });
        
    }
}