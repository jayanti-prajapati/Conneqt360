export interface RegisterPayload {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
