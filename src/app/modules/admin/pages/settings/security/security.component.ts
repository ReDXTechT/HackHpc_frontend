import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {AuthenticationService} from "../../../../../core/services/authentication.service";
import {UsersService} from "../../../../../core/services/users.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSnackBarModule ,FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatButtonModule],
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private authenticationService: AuthenticationService,
        private usersService: UsersService,
        private _snackbar: MatSnackBar,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.securityForm = this._formBuilder.group({
            password  : [''],
            new_password      : [''],

        });
    }

    changePassword(){
        this.usersService.getUserById(this.authenticationService.currentUserValue.id).subscribe(user=>{
            this.authenticationService.changePassword(this.authenticationService.currentUserValue.id , user.email ,this.securityForm.value.password ,this.securityForm.value.new_password  ).subscribe(res=>{
                console.log(res)
                this._snackbar.open(res.message, 'Close', {
                    duration: 5000,
                });
            })
        })
    }
}
