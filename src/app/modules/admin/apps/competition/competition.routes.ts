import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddCompetition} from "./add-competition/add-competition.component";

const routes: Routes = [

  {
    path: 'add-competition',
    component: AddCompetition
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionRoutes {}
