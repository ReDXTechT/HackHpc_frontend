import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AuthenticationService} from "../../../core/services/authentication.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector     : 'sign-up-classic',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    providers:[MatSnackBar],
    imports: [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    selectedImage: File = null;
    image: string = null;
    selectedCV: File = null;
    cvFileName: string;

    constructor(
        private authService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,

    )
    {
    }

    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            firstName      : ['', Validators.required],
            lastName      : ['', Validators.required],
            email     : ['', [Validators.required, Validators.email]],
            mobile_phone   : ['',Validators.required],
            password  : ['', Validators.required],
            biography  : ['', Validators.required],
            gender  : ['', Validators.required],
            birthdate  : ['', Validators.required],
            address  : ['',Validators.required],
            organization_name: ['',Validators.required],
            occupation: ['',Validators.required],
            skills: ['',Validators.required],
            role: ['', Validators.requiredTrue],
            cv: ['',Validators.required],
            image: ['', Validators.requiredTrue],
            },
        );
    }

    onImageSelected(event) {
        this.selectedImage = <File>event.target.files[0];
        this.image = URL.createObjectURL(this.selectedImage);

    }

    onCVSelected(event) {
        this.selectedCV = <File>event.target.files[0];
        this.cvFileName = this.selectedCV ? this.selectedCV.name : '';
    }
    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, 'close', {
            duration: 5000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
    }
    signUp(): void
    {
        const formData = new FormData();
        const birthdate = new Date(this.signUpForm.get('birthdate').value).toISOString().split('T')[0];

        formData.append('firstName', this.signUpForm.get('firstName').value);
        formData.append('lastName', this.signUpForm.get('lastName').value);
        formData.append('email', this.signUpForm.get('email').value);
        formData.append('mobile_phone', this.signUpForm.get('mobile_phone').value);
        formData.append('password', this.signUpForm.get('password').value);
        formData.append('biography', this.signUpForm.get('biography').value);
        formData.append('gender', this.signUpForm.get('gender').value);
        formData.append('birthdate', birthdate);
        formData.append('password', this.signUpForm.get('password').value);
        if(this.signUpForm.value.role=='customer'){
            if (this.selectedImage) {
                formData.append('image', this.selectedImage);
                formData.append('organization_name', this.signUpForm.get('organization_name').value);
                formData.append('address', this.signUpForm.get('address').value);
                formData.append('occupation', this.signUpForm.get('occupation').value);

               this.authService.registerCustomer(formData).subscribe(res=>{
                   this.showNotification(
                       'snackbar-success',
                       res.message,
                       'bottom',
                       'center'
                   );
               })

                // Now, you can use the formData object for your submission, e.g., HTTP POST.
            } else {
                alert("Please select an image and fill all required fields before submitting.");
            }
        }else{
                // Construct a FormData object
                // Construct a FormData object
                let missingSelections = [];

                if (this.selectedCV) {
                    formData.append('cv', this.selectedCV);
                } else {
                    missingSelections.push("CV");
                }

                if (this.selectedImage) {
                    formData.append('image', this.selectedImage);
                } else {
                    missingSelections.push("image");
                }

                if (missingSelections.length === 0) {
                    // Append other form data
                    formData.append('skills', this.signUpForm.get('skills').value);

                    // Call your service to register the competitor
                    this.authService.registerCompetitor(formData).subscribe(res => {
                        this.showNotification(
                            'snackbar-success',
                            res.message,
                            'bottom',
                            'center'
                        );
                    });

                } else {
                    let alertMessage = "Please select ";

                    if (missingSelections.length === 2) {
                        alertMessage += `a ${missingSelections[0]} and an ${missingSelections[1]}`;
                    } else {
                        alertMessage += `a ${missingSelections[0]}`;
                    }

                    alert(alertMessage + " before submitting.");
                }

        }

    }
}
