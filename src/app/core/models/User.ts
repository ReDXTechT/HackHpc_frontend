export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    mobile_phone: string;
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
    organization_name: string;
    biography?: string;
    approved: boolean;
}
