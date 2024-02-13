import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import axios from 'axios';

import { DataService } from '../data.service';

interface BudgetItem {
  title: string;
  budget: number;
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  public dataSource!: { label: string; value: number }[];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.dataSource = [
      {
        title: 'Eat out',
        budget: 25,
      },
      {
        title: 'Rent',
        budget: 225,
      },
      {
        title: 'Grocery',
        budget: 170,
      },
      {
        title: 'Medical Expenses',
        budget: 70,
      },
      {
        title: 'Car Insurance',
        budget: 30,
      },
      {
        title: 'Shopping',
        budget: 100,
      },
      {
        title: 'Health Insurance',
        budget: 25,
      },
    ].map((obj: BudgetItem) => {
      return { label: obj.title, value: obj.budget };
    });

    console.log(this.dataSource);
    this.createCharts();
  }

  createCharts(): void {
    this.createPieChart();
    this.createDonutChart();
  }

  createPieChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx && this.dataSource) {
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [
            {
              data: this.dataSource.map(
                (item: { label: string; value: number }) => item.value
              ),
              backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19'],
            },
          ],
          labels: this.dataSource.map(
            (item: { label: string; value: number }) => item.label
          ),
        },
      });
    }
  }

  createDonutChart(): void {
    const width = 600;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal<string>()
      .domain(
        this.dataSource.map(
          (item: { label: string; value: number }) => item.label
        )
      )
      .range([
        '#ffcd56',
        '#ff6384',
        '#36a2eb',
        '#fd6b19',
        '#09ee09',
        '#3366cc',
        '#00ff67',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
      ]);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const outerArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const svg = d3
      .select<SVGSVGElement, unknown>('#donut')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const dataReady = pie(this.dataSource);

    svg
      .selectAll('path')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg
      .selectAll('polyline')
      .data(dataReady)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d) => {
        const posA = arc.centroid(d) as [number, number];
        const posB = outerArc.centroid(d) as [number, number];
        const posC = outerArc.centroid(d) as [number, number];
        posC[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC].map((pos) => pos.join(',')).join(' ');
      });

    svg
      .selectAll('text')
      .data(dataReady)
      .enter()
      .append('text')
      .text((d) => d.data.label)
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.99 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', (d) =>
        this.midAngle(d) < Math.PI ? 'start' : 'end'
      );
  }

  private midAngle(d: d3.PieArcDatum<{ label: string; value: number }>) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
}