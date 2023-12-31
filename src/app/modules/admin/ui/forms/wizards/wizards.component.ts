import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    FormArray, FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { CommonModule } from '@angular/common';
import {CompetitionService} from "../../../../../core/services/competition.service";

@Component({
    selector     : 'forms-wizards',
    templateUrl  : './wizards.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [CommonModule,MatIconModule, FormsModule,MatDatepickerModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],
})
export class FormsWizardsComponent implements OnInit
{
    horizontalStepperForm: UntypedFormGroup;
    loading = false;
    constructor(private _formBuilder: UntypedFormBuilder,
                private competitionService: CompetitionService,
                private _changeDetectorRef: ChangeDetectorRef,)
    {
    }
    ngOnInit(): void
    {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                title   : ['', [Validators.required]],
                code_type : ['', Validators.required],
                git_repo_url : ['', Validators.required],
                project_description  : ['', Validators.required],
                skills_required  : ['', Validators.required],
                optimization_guidelines  : ['', Validators.required],
                max_competitors  : ['', Validators.required],
                winner_announcement_date   : ['', Validators.required],
                submission_deadline   : ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                processor : ['', Validators.required],
                vcpu  : ['', Validators.required],
                cpu_memory  : ['', Validators.required],
                storage    : ['',Validators.required],
                graphics_card : [''],
                graphics_card_memory : [''],
                parallel_processing_units : [''],
                architectureType: ['CPU', Validators.required],
            }),
            step3: this._formBuilder.group({
                prizes: this._formBuilder.array([]),
            }),
            step4: this._formBuilder.group({
                questions: this._formBuilder.array([],[Validators.required ,Validators.minLength(2), Validators.maxLength(2)]),
                minimal_score : ['', Validators.required],
            }),
        });


        // Vertical stepper form
        if(this.prizes.length==0){
            const prize = this._formBuilder.group({
                prize: ['',Validators.required],
                label: ['',Validators.required],
            });
            this.prizes.push(prize);
        }

    }
    get prizes(): FormArray {
        return this.horizontalStepperForm.get('step3').get('prizes') as FormArray;
    }
    get questions(): FormArray {
        return this.horizontalStepperForm.get('step4').get('questions') as FormArray;
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    addPrize(): void {
        // Create an empty prize form group
        const prize = this._formBuilder.group({
            prize: ['',Validators.required],
            label: ['',Validators.required],
        });

        // Add the prize form group to the prizes form array
        const prizes = this.horizontalStepperForm.get('step3').get('prizes') as FormArray;
        prizes.push(prize);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    getPlaceholder(index: number): string {
        const suffixes = ['st', 'nd', 'rd'];
        const suffix = suffixes[index] || 'th';
        return `${index + 1}${suffix} prize`;
    }

    removePrize(index: number): void {
        // Get form array for prizes
        const prizes = this.horizontalStepperForm.get('step3').get('prizes') as UntypedFormArray;

        // Remove the prize field
        prizes.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    AddQuestion(): void {
        const question = this._formBuilder.group({
            text: ['', Validators.required],
            options: this._formBuilder.array([], Validators.required)
        });

        // Add custom validators for the first two questions
        if (this.questions.length < 2) {
            question.get('text')?.setValidators([Validators.required]);
            question.get('options')?.setValidators([Validators.required]);
        }

        const questions = this.horizontalStepperForm.get('step4').get('questions') as FormArray;
        questions.push(question);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    onRemoveQuestion(index: number): void {
        // Get form array for prizes
        const questions = this.horizontalStepperForm.get('step4').get('questions') as UntypedFormArray;

        // Remove the prize field
        questions.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    options(questionIndex: number): FormArray {
        const questions = this.horizontalStepperForm.get('step4').get('questions') as FormArray;
        return questions.controls[questionIndex].get('options') as FormArray;
    }

    onAddOption(questionIndex: number): void {
        const options = this.questions.controls[questionIndex].get('options') as FormArray;
        const option = this._formBuilder.group({
            text: ['', Validators.required],
            is_correct: [false],
        });
        options.push(option);
    }

    onRemoveOption(questionIndex: number, optionIndex: number): void {
        const options = this.questions.controls[questionIndex].get('options') as FormArray;
        options.removeAt(optionIndex);
    }
    formatFormData(formValue: any) {
        const step1 = formValue.step1;
        const step2 = formValue.step2;
        const step3 = formValue.step3;
        const step4 = formValue.step4;

        const prizes = step3.prizes.map(prize => {
            return {
                level: prize.label,
                amount: prize.prize
            };
        });
        const winnerAnnouncementDate = new Date(step1.winner_announcement_date).toISOString().split('T')[0];
        const submissionDeadline = new Date(step1.submission_deadline).toISOString().split('T')[0];

        const formattedData = {
            title: step1.title,
            git_repo_url: step1.git_repo_url,
            code_type: step1.code_type,
            project_description: step1.project_description,
            skills_required: step1.skills_required,
            optimization_guidelines: step1.optimization_guidelines,
            max_competitors: step1.max_competitors,
            winner_announcement_date: winnerAnnouncementDate,
            submission_deadline: submissionDeadline,
            prizes: prizes,
            target_architecture: {
                processor: step2.processor,
                vcpu: step2.vcpu,
                cpu_memory: step2.cpu_memory,
                storage: step2.storage,
                graphics_card: step2.graphics_card,
                graphics_card_memory: step2.graphics_card_memory,
                parallel_processing_units: step2.parallel_processing_units,

            },
            quiz: {
                minimal_score: step4.minimal_score,
                questions: step4.questions
            }
        };

        return formattedData;
    }
    onSubmit(): void {
        // console.log(this.formatFormData(this.horizontalStepperForm.value))
        if (this.horizontalStepperForm.valid) {
            this.loading=true
            this.competitionService.createCompetition(this.horizontalStepperForm.value).subscribe(competition=>{
                console.log(competition)
                this.loading=false
            })
            // Log the form value to the console
        }
        // console.log(this.horizontalStepperForm.value);

    }

}
