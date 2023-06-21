import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotesService } from 'app/modules/admin/apps/notes/notes.service';
import { Label, Note, Task } from 'app/modules/admin/apps/notes/notes.types';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../../core/services/competition.service";
import {Competition, Quiz} from "../../../../../../core/models/competiton";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
    selector: 'edit-overview',
    templateUrl: './quiz-passing.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatRadioModule],
})
export class QuizPassing implements OnInit {
    quizzes: Quiz;
    competitionTitle: string;
    quizForm: UntypedFormGroup
    public name: string = "";
    public questionList: any = [];
    public currentQuestion: number = 0;
    public points: number = 0;
    counter = 60;
    correctAnswer: number = 0;
    inCorrectAnswer: number = 0;
    interval$: any;
    progress: string = "0";
    isQuizCompleted : boolean = false;
    showResult : boolean = false;
    score : any ;
    selectedOptions: any[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { quizzes: any , competition_title },
        private competitionService: CompetitionService,
        private _matDialogRef: MatDialogRef<QuizPassing>,
        private _formBuilder: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef,

    )
    {
        this.quizzes=this._data.quizzes[0]
        this.competitionTitle = this._data.competition_title
    }

    ngOnInit(): void
    {
        console.log(this._data.quizzes[0].minimal_score)
        console.log(this._data.quizzes[0].questions)
        console.log(this._data.quizzes[0].competition)
        this.quizForm = this._formBuilder.group({
            name: ['',Validators.required],
            questions: this._formBuilder.array([],Validators.required)
        });
        this.getAllQuestions();

    }


    answer(currentQno: number, option: any) {
        // Toggle the selected state of the option
        option.selected = !option.selected;

        // If option is selected, add it to the array; otherwise, remove it.
        if (option.selected) {
            console.log("select");
            this.selectedOptions.push(option);
        } else {
            console.log("unselect");
            this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);
        }
        console.log(this.selectedOptions);
    }

    getAllQuestions() {
        // Assuming this._data.quizzes is available and contains the quiz data.
        this.questionList = this._data.quizzes[0].questions;

        // You might want to initialize currentQuestion to 0 here.
        this.currentQuestion = 0;

        // Clear previously selected options
        this.selectedOptions = [];
    }

    nextQuestion() {
        // Navigate to the next question if not at the end.
        if (this.currentQuestion < this.questionList.length - 1) {
            this.currentQuestion++;

            // Clear the selected options for the new question
            this.selectedOptions = [];
        }
    }

    previousQuestion() {
        // Navigate to the previous question if not at the start.
        if (this.currentQuestion > 0) {
            this.currentQuestion--;

            // Clear the selected options for the new question
            this.selectedOptions = [];
        }
    }
    currentSelectedOption: number | null = null;

    isOptionSelected(optionIndex: number): boolean {
        return this.currentSelectedOption === optionIndex;
    }

    selectOption(optionIndex: number): void {
        this.currentSelectedOption = optionIndex;
    }

    unselectOption(): void {
        this.currentSelectedOption = null;
    }

    // verify(question: any) {
    //     const correctOptions = question.options.filter(option => option.is_correct);
    //     let allCorrect = true;
    //
    //     for (const option of question.options) {
    //         if (option.selected) {
    //             if (!option.is_correct) {
    //                 allCorrect = false;
    //             }
    //         } else {
    //             if (option.is_correct) {
    //                 allCorrect = false;
    //             }
    //         }
    //     }
    //
    //     for (const option of question.options) {
    //         option.selectedClass = '';
    //         if (option.selected) {
    //             option.selectedClass = 'selected';
    //         }
    //         if (option.is_correct) {
    //             console.log("correct",option)
    //
    //             option.selectedClass += ' correct';
    //         } else if (option.selected) {
    //             console.log("wrong",option)
    //
    //             option.selectedClass += ' wrong';
    //         }
    //     }
    //
    //     this.selectedOptions = question.options.filter(option => option.selected);
    //
    //     if (allCorrect && !question.verified) {
    //         question.verified = true;
    //         this.points++;
    //         this.correctAnswer++;
    //     }else{
    //         this.inCorrectAnswer++;
    //     }
    //     console.log("verify",this.selectedOptions)
    //
    //     this.changeDetectorRef.detectChanges();
    // }


    resetQuiz() {
        this.selectedOptions=[]
        this.currentQuestion = 0;
        this.points = 0;

        for (const question of this.questionList) {
            for (const option of question.options) {
                option.selected = false;
                option.verified = false;
                option.selectedClass = '';
            }
        }

        this.changeDetectorRef.detectChanges();
        this.isQuizCompleted = false;
        this.showResult = false;
        this.getAllQuestions();
        this.counter = 60;
        this.progress = "0";

    }
    getProgressPercent() {
        this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
        return this.progress;

    }
    ShowResult() {
        this.showResult = true
        this.score = ((this.points / this.questionList.length) * 100).toFixed(2);
        const body = { score: this.score };

        //
        // this.courseService.addScoreInModule(this.data.courseId,this.data.quizz.id,this.data.moduleId,this.data.userId,body).subscribe(res=>{
        //     console.log(res)
        // })

    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
