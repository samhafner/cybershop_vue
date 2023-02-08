export interface Profile {
    department: string;
    level: string;
    username: string;
    firstName: string;
    lastName: string;
    id: number;
    joinDate: string;
    email: string;
}

export interface SignupData {
    password: string;
    email: string;
    firstname: string;
    lastname: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    tags: string[];
    brand: string;
    image: string;
}

export interface FilterParams {
    brand?: string;
    tag?: string;
    q?: string;
}