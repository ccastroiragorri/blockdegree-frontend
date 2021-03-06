/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdministratorService} from './Administrator.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Administrator',
	templateUrl: './Administrator.component.html',
	styleUrls: ['./Administrator.component.css'],
	providers: [AdministratorService]
})
export class AdministratorComponent implements OnInit {

	myForm: FormGroup;
	email = new FormControl('', Validators.required);
	firstName = new FormControl('', Validators.required);
	lastName = new FormControl('', Validators.required);
	publicKey = new FormControl('', Validators.required);
	private allParticipants;
	private participant;
	private currentId;
	private errorMessage;

	constructor(private serviceAdministrator: AdministratorService, fb: FormBuilder) {
		this.myForm = fb.group({


			email: this.email,


			firstName: this.firstName,


			lastName: this.lastName,


			publicKey: this.publicKey


		});
	};

	ngOnInit(): void {
		this.loadAll();
	}

	loadAll(): Promise<any> {
		let tempList = [];
		return this.serviceAdministrator.getAll()
			.toPromise()
			.then((result) => {
				this.errorMessage = null;
				result.forEach(participant => {
					tempList.push(participant);
				});
				this.allParticipants = tempList;
			})
			.catch((error) => {
				if (error == 'Server error') {
					this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
				}
				else if (error == '404 - Not Found') {
					this.errorMessage = '404 - Could not find API route. Please check your available APIs.'
				}
				else {
					this.errorMessage = error;
				}
			});
	}

	/**
	 * Event handler for changing the checked state of a checkbox (handles array enumeration values)
	 * @param {String} name - the name of the participant field to update
	 * @param {any} value - the enumeration value for which to toggle the checked state
	 */
	changeArrayValue(name: string, value: any): void {
		const index = this[name].value.indexOf(value);
		if (index === -1) {
			this[name].value.push(value);
		} else {
			this[name].value.splice(index, 1);
		}
	}

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
	 * only). This is used for checkboxes in the participant updateDialog.
	 * @param {String} name - the name of the participant field to check
	 * @param {any} value - the enumeration value to check for
	 * @return {Boolean} whether the specified participant field contains the provided value
	 */
	hasArrayValue(name: string, value: any): boolean {
		return this[name].value.indexOf(value) !== -1;
	}

	addParticipant(form: any): Promise<any> {
		this.participant = {
			$class: 'org.degree.Administrator',


			'email': this.email.value,


			'firstName': this.firstName.value,


			'lastName': this.lastName.value,


			'publicKey': this.publicKey.value


		};

		this.myForm.setValue({


			'email': null,


			'firstName': null,


			'lastName': null,


			'publicKey': null


		});

		return this.serviceAdministrator.addParticipant(this.participant)
			.toPromise()
			.then(() => {
				this.errorMessage = null;
				this.myForm.setValue({


					'email': null,


					'firstName': null,


					'lastName': null,


					'publicKey': null


				});
			})
			.catch((error) => {
				if (error == 'Server error') {
					this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
				}
				else {
					this.errorMessage = error;
				}
			});
	}


	updateParticipant(form: any): Promise<any> {
		this.participant = {
			$class: 'org.degree.Administrator',


			'firstName': this.firstName.value,


			'lastName': this.lastName.value,


			'publicKey': this.publicKey.value


		};

		return this.serviceAdministrator.updateParticipant(form.get('email').value, this.participant)
			.toPromise()
			.then(() => {
				this.errorMessage = null;
			})
			.catch((error) => {
				if (error == 'Server error') {
					this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
				}
				else if (error == '404 - Not Found') {
					this.errorMessage = '404 - Could not find API route. Please check your available APIs.'
				}
				else {
					this.errorMessage = error;
				}
			});
	}


	deleteParticipant(): Promise<any> {

		return this.serviceAdministrator.deleteParticipant(this.currentId)
			.toPromise()
			.then(() => {
				this.errorMessage = null;
			})
			.catch((error) => {
				if (error == 'Server error') {
					this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
				}
				else if (error == '404 - Not Found') {
					this.errorMessage = '404 - Could not find API route. Please check your available APIs.'
				}
				else {
					this.errorMessage = error;
				}
			});
	}

	setId(id: any): void {
		this.currentId = id;
	}

	getForm(id: any): Promise<any> {

		return this.serviceAdministrator.getparticipant(id)
			.toPromise()
			.then((result) => {
				this.errorMessage = null;
				let formObject = {


					'email': null,


					'firstName': null,


					'lastName': null,


					'publicKey': null


				};


				if (result.email) {

					formObject.email = result.email;

				} else {
					formObject.email = null;
				}

				if (result.firstName) {

					formObject.firstName = result.firstName;

				} else {
					formObject.firstName = null;
				}

				if (result.lastName) {

					formObject.lastName = result.lastName;

				} else {
					formObject.lastName = null;
				}

				if (result.publicKey) {

					formObject.publicKey = result.publicKey;

				} else {
					formObject.publicKey = null;
				}


				this.myForm.setValue(formObject);

			})
			.catch((error) => {
				if (error == 'Server error') {
					this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
				}
				else if (error == '404 - Not Found') {
					this.errorMessage = '404 - Could not find API route. Please check your available APIs.'
				}
				else {
					this.errorMessage = error;
				}
			});

	}

	resetForm(): void {
		this.myForm.setValue({


			'email': null,


			'firstName': null,


			'lastName': null,


			'publicKey': null


		});
	}

}
