import { IUser } from "../../types";
import { AuthRepository } from "./auth.repository";


export class AuthService {
    private authRepo = new AuthRepository();

    async register(registerData: {email: string, password: string, confirmPassword: string, phone: string}) {
        return this.authRepo.create(registerData);
    }

    async login(loginData: { email: string, password: string }) {
        return this.authRepo.create(loginData);
    }

    async otpLogin(otpData: Partial<IUser>) {
        return this.authRepo.create(otpData);
    }

    async verifyOtp(verifyData: Partial<IUser>) {
        return this.authRepo.create(verifyData);
    }

    async getAll() {
        return this.authRepo.findAll();
    }

    async getByPhone(phone: string) {
        return this.authRepo.findByPhone(phone);
    }

}