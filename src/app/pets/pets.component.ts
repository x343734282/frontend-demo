import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { noop, Observable, Observer, of, Subscriber, from } from 'rxjs';
import { map, switchMap, tap, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';


@Component({
	selector: 'app-pets',
	templateUrl: './pets.component.html',
	styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
	public cats: any;

	constructor(private http: HttpClient) { }

	ngOnInit() {
		this.fetchCats();
	}


	private fetchCats(): void {
		this.http
			.get<any>(
				`${environment.baseUrl}/owners`
			)
			.pipe(map(owners => owners || []))
			.pipe(map(data => _.flatMap(data, ({ gender, pets }) => _.map(pets, (pet) => ({ gender: gender, type: pet.type, petName: pet.name })))))
			.pipe(map(data => data.filter(item => item.type === 'Cat')))
			.pipe(map(pets => _.groupBy(pets, pet => pet.gender)))
			.subscribe(data => {
				this.cats = [];
				if (data) {
					// code...
					const newData = Object.entries(data);
					for (const [key, list] of Object.entries(data)) {
						const sorted = list.sort((a, b) => {
							if (a.petName < b.petName) { return -1; }
							if (a.petName > b.petName) { return 1; }
							return 0;
						});
						data[key] = sorted;
					}
					this.cats = Object.entries(data);
				}
				console.log(data);

			});
	}
}
