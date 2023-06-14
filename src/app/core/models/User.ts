export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    mobilePhone: string;
    isCompetitor: boolean;
    isCustomer: boolean;
    isActive: boolean;
    isStaff: boolean;
    image: string;
}

export interface Competitor {
    user: User
    skills: string;
}

export interface Customer {
    user: User
    organizationName: string;
    biography?: string;
    approved: boolean;
}
