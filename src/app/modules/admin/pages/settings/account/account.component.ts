import {TextFieldModule} from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {DatePipe, NgIf} from "@angular/common";
import {AuthenticationService} from "../../../../../core/services/authentication.service";
import {UsersService} from "../../../../../core/services/users.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatSnackBarModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, NgIf, MatDatepickerModule],
providers:[DatePipe]
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;
    role: any
    user: any
    selectedCV: File = null;
    cvFileName: string;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private authenticationService: AuthenticationService,
        private usersService: UsersService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackbar: MatSnackBar,
        private datePipe: DatePipe,

    ) {
        this.role = this.authenticationService.currentUserValue.role
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.accountForm = this._formBuilder.group({
            firstName: [''],
            lastName: [''],
            occupation: [''],
            email: [''],
            mobile_phone: [''],
            address: [''],
            organization_name: [''],
            biography: [''],
            birthdate: [''],
            skills: ['']
        });
        this.getUserById(this.authenticationService.currentUserValue.id)
    }

    getUserById(userId) {
        if (this.role === 'Customer') {
            this.usersService.getCustomerDetailsById(userId).subscribe(res => {
                this.user = res;
                console.log(this.user.user.email);
                this.accountForm = this._formBuilder.group({
                    firstName: [this.user.user.firstName],
                    lastName: [this.user.user.lastName],
                    occupation: [this.user.occupation],
                    email: [this.user.user.email, Validators.email],
                    mobile_phone: [this.user.user.mobile_phone],
                    address: [res.address],
                    organization_name: [this.user.organization_name],
                    biography: [this.user.biography],
                    birthdate: [res.birthdate],
                });
                this._changeDetectorRef.detectChanges();
            });
        } else {
            this.usersService.getCompetitorDetailsById(userId).subscribe(res => {
                this.user = res;
                console.log(this.user.user.email);
                this.accountForm = this._formBuilder.group({
                    firstName: [this.user.user.firstName],
                    lastName: [this.user.user.lastName],
                    email: [this.user?.user?.email],
                    mobile_phone: [this.user.user.mobile_phone],
                    biography: [this.user.biography],
                    skills: [this.user.skills],
                    birthdate: [this.user.birthdate],
                });
                this._changeDetectorRef.detectChanges();
            });
        }
    }

    onCVSelected(event) {
        this.selectedCV = <File>event.target.files[0];
        this.cvFileName = this.selectedCV ? this.selectedCV.name : '';
    }
    formatDate(date: string): string {
        if (date) {
            const formattedDate = new Date(date);
            return this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
        }
        return '';
    }
    updateInfos() {

        if (this.authenticationService.currentUserValue.role === 'Customer') {
            const payload = {
                email: this.accountForm.value.email,
                firstName: this.accountForm.value.firstName,
                lastName: this.accountForm.value.lastName,
                mobile_phone:this.accountForm.value.mobile_phone,
                organization_name:this.accountForm.value.organization_name,
                biography: this.accountForm.value.biography,
                address: this.accountForm.value.address,
                birthdate: this.formatDate(this.accountForm.value.birthdate),
                occupation: this.accountForm.value.occupation
            };
            this.usersService.updateCustomer(payload, this.authenticationService.currentUserValue.id).subscribe(res => {
                console.log(res.message)
                this._snackbar.open(res.message, 'Close', {
                    duration: 5000,
                });
                window.location.reload()


            })
        } else {
            const formData = new FormData();
            const birthdate =this.formatDate(this.accountForm.value.birthdate);

            formData.append('firstName', this.accountForm.get('firstName').value);
            formData.append('lastName', this.accountForm.get('lastName').value);
            formData.append('email', this.accountForm.get('email').value);
            formData.append('mobile_phone', this.accountForm.get('mobile_phone').value);
            formData.append('biography', this.accountForm.get('biography').value);
            formData.append('birthdate', birthdate);
            formData.append('skills', this.accountForm.get('skills').value);

            if (this.selectedCV) {
                formData.append('cv', this.selectedCV);}

            this.usersService.updateCompetitor(formData, this.authenticationService.currentUserValue.id).subscribe(res => {
                console.log(res.message)
                this._snackbar.open(res.message, 'Close', {
                    duration: 5000,
                });
                window.location.reload()
            })
        }

    }
}
