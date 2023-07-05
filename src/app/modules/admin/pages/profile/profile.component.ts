import { TextFieldModule } from '@angular/cdk/text-field';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {AuthenticationService} from "../../../../core/services/authentication.service";
import {UsersService} from "../../../../core/services/users.service";
import {MatTabsModule} from "@angular/material/tabs";
import {SettingsAccountComponent} from "../settings/account/account.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {Competition} from "../../../../core/models/competiton";
import {ActivitiesComponent} from "../activities/activities.component";

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    styleUrls : ['profile.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatSnackBarModule, RouterLink, FuseCardComponent, NgFor, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass, MatCardModule, MatExpansionModule, MatTabsModule, NgIf, SettingsAccountComponent, ActivitiesComponent],
})
export class ProfileComponent
{
    role : string
    user : any
    userId : any
    teamMemberId : any
    selectedImage: File;
    image: string = null;
    Contributions : Competition[]
    customerCompetitions : Competition[]
    Achievements : any[]

    constructor(private authService : AuthenticationService,
                private userService : UsersService,
                private _changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,

                private _snackbar: MatSnackBar,

    )
    {
        if(this.authService.currentUser){
            this.role = this.authService.currentUserValue.role
            this.userId = this.authService.currentUserValue.id
        }

        if(this.route.snapshot.paramMap.get('id')){
            console.log('heyyyyyyyyy')
            this.teamMemberId = this.route.snapshot.paramMap.get('id');
            this.getCompetitorById(this.teamMemberId)
            this.getCompetitorContributions(this.teamMemberId)
            this.getCompetitorAchievements(this.teamMemberId)

        }else{
            this.getUserById(this.userId)
            if(this.role==='Competitor'){
                this.getCompetitorContributions(this.userId)
                this.getCompetitorAchievements(this.userId)

            }
            else {
                this.getCustomerCompetitions()
            }
        }

    }
    isClickableStatus(status: string): boolean {
        return ['Running', 'About_to_start', 'Terminated','pending'].includes(status);
    }

    getUserById(userId){
        if(this.role==='Customer'){
            this.userService.getCustomerDetailsById(userId).subscribe(res=>{
                this.user = res
                console.log(res)
                this._changeDetectorRef.detectChanges()

            })
        }else{
            this.userService.getCompetitorDetailsById(userId).subscribe(res=>{
                this.user = res
                console.log(res)
                this._changeDetectorRef.detectChanges()

            })
        }

    }
    getCompetitorById(userId){

            this.userService.getCompetitorDetailsById(userId).subscribe(res=>{
                this.user = res
                console.log(res)
                this._changeDetectorRef.detectChanges()

            })


    }

    public updateProfilePicture(userId : number): void {
        const formData = new FormData();
        formData.append('image', this.selectedImage);

        this.userService.updateProfilePicture(userId,formData).subscribe(res=>{
            console.log(res)
            window.location.reload()

        })
    }
    onImageSelected(event) {
        this.selectedImage = <File>event.target.files[0];
        this.image = URL.createObjectURL(this.selectedImage);

    }
    getCompetitorAchievements(userId:any) {
        this.userService.getCompetitorAchievements(userId).subscribe(res=>{
            console.log(res)
            this.Achievements=res
        })
    }
    getCompetitorContributions(userId:any) {
        this.userService.getCompetitorContributions(userId).subscribe(res=>{
            console.log('--------------------------',res)
            this.Contributions=res
        })
    }
    getCustomerCompetitions() {
        console.log('tttt')
        this.userService.getCustomerCompetitions(this.authService.currentUserValue.id).subscribe(res=>{
            console.log(res)
            this.customerCompetitions=res
            this._changeDetectorRef.detectChanges()
        })
    }

}
