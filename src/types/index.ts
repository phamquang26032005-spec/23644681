// src/types/index.ts
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
}
