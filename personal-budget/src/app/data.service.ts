import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    public dataSource: any = {
        datasets: [
          {
            data: [],
            backgroundColor: [
                '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            '#33FF57',
                            '#33FFFF',
                            '#FF33FF',
            ],
          },
        ],
        labels: [],
    };;
    
    constructor(private http: HttpClient) { 
        this.getData();
    }

    isEmpty(val:any){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
      }

    getData(){
        if (this.isEmpty(this.dataSource.datasets[0].data)|| this.isEmpty(this.dataSource.labels)){
            this.http.get('http://localhost:3000' + '/budget').subscribe((res: any) => {
                console.log('server res', res);
                for (let i = 0; i < res.myBudget.length; i++) {
                    this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
                    this.dataSource.labels[i] = res.myBudget[i].title;
                }
              });
            }
    }
}