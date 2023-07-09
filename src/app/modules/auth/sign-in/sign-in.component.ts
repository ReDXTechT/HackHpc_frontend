import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {AuthenticationService} from "../../../core/services/authentication.service";
import {FuseNavigationService, FuseVerticalNavigationComponent} from "../../../../@fuse/components/navigation";

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    @ViewChild(FuseVerticalNavigationComponent) fuseNavComponent: FuseVerticalNavigationComponent;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    showAlert: boolean = false;
    signInForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private fuseNavigationService: FuseNavigationService
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
        this.fuseNavigationService.registerComponent('mainNavigation', this.fuseNavComponent);

        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.login(this.signInForm.value.email,this.signInForm.value.password)
            .subscribe(
                res =>
                {
                    // console.log(res)
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

                    // Redirect to the attempted URL, or to the default URL if no attempted URL was found

                    if (res.msg =='Invalid Credentials'){
                        this.signInForm.enable();

                        // Reset the form
                        this.signInNgForm.resetForm();

                        // Set the alert
                        this.alert = {
                            type   : 'error',
                            message: 'Wrong email or password',
                        };

                        // Show the alert
                        this.showAlert = true;
                    }
                    else{
                        if (returnUrl) {

                            // return res;
                            console.log(returnUrl)
                            // Redirect to the returnUrl
                            this.router.navigate([returnUrl]);
                        } else {
                            // Redirect to the default URL
                            this.router.navigate(['/home']);
                        }
                    }

                }
            );
    }
}
