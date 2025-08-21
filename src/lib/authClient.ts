import { AxiosError } from "axios";
import instance from "./axios";

export type AuthResponse = {
    success: boolean;
    user?: {
        id: string;
        email: string;
    };
    token?: string;
    error?: string;
}

export const auth = {
    async signUp(email: string, password: string): Promise<AuthResponse> {
        const response = await instance.post('/auth/signup', { email, password });
        return response.data;
    },
    async signIn(email: string, password: string): Promise<AuthResponse | Error> {
        try {
            const response = await instance.post<AuthResponse>("/auth/signin", {
                email,
                password,
            });

            console.log("SignIn Response:", response.data);

            if (response.data.success && response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            return response.data;
        } catch (err) {
            const error = err as AxiosError<any>;

            return {
                success: false,
                error: error.response?.data?.error || "Authentication failed",
            };
        }
    },

    async signOut() {
        localStorage.removeItem("token");
        return { success: true };
    },

    async getUser(): Promise<AuthResponse> {
        try {
            const { data } = await instance.get("/auth/me");
            return data;
        } catch (err: any) {
            return { success: false, error: "Not authenticated" };
        }
    }
}