import {Competitor, Customer} from "./User";

export interface Competition {
    id?: number;
    title: string;
    git_repo_url: string;
    code_type: 'openacc' | 'openmp' | 'mpi' | 'c_cpp';
    sponsor: number;
    customer : Customer
    instance_type: string;
    ami: string;
    project_description: string;
    skills_required: string;
    optimization_guidelines: string;
    max_competitors: number;
    winner_announcement_date: Date;
    submission_deadline: Date;

    starting_date: Date;
    prizes : Prize[]
    status: 'pending' | 'update_pending_approval' | 'approved' | 'rejected' | 'Running'| 'Terminated' | 'About_to_start';
    competitors?: Competitor[];
    target_architecture: TargetArchitecture;
    quizzes : Quiz[]
}

export interface Prize {
    id?: number;
    competitionId: number;
    level: string;
    amount: number;
}

export interface Quiz {
    id?: number;
    competitionId: number;
    minimal_score: number;
    questions : Question[]
}

export interface Question {
    id?: number;
    text: string;
    quizId: number;
    options : Option[]
}

export interface Option {
    id?: number;
    text: string;
    questionId: number;
    is_correct: boolean;
}

export interface Score {
    id?: number;
    competitorId: number;
    competitionId: number;
    quizId: number;
    score: number;
}

export interface TargetArchitecture {
    id?: number;
    competitionId: number;
    processor: string;
    vcpu: number;
    cpu_memory: string;
    storage: string;
    graphics_card?: string;
    graphics_card_memory?: string;
    parallel_processing_units?: number;
}
