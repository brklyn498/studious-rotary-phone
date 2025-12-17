import { apiFetch, type User } from '@/lib/api';

export interface RegisterData {
    name: string;
    phone: string;
    email?: string;
    password: string;
    password_confirm: string;
    user_type: 'farmer' | 'business';
    company_name?: string;
    inn?: string;
    region_name?: string;
    preferred_language?: string;
}

export interface LoginData {
    phone: string;
    password?: string;
    initData?: string; // For Telegram auth
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
    is_new?: boolean;
}

export const authApi = {
    /**
     * Register a new user
     */
    register: (data: RegisterData) => {
        // Split name into first and last name if possible
        const nameParts = data.name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Use phone as username if not provided
        const username = data.phone.replace(/[^\d]/g, '');

        const payload = {
            username,
            phone: data.phone,
            email: data.email || undefined,
            password: data.password,
            password_confirm: data.password_confirm,
            first_name,
            last_name,
            user_type: data.user_type,
            company_name: data.company_name,
            inn: data.inn,
            region_name: data.region_name,
            preferred_language: data.preferred_language || 'ru',
        };

        return apiFetch<{ message: string; user: User }>('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    /**
     * Login with phone and password
     */
    login: (data: LoginData) => {
        // Standard JWT login
        if (data.password) {
            // Note: Backend likely expects 'username' and 'password'.
            // We'll use phone as username.
            const username = data.phone.replace(/[^\d]/g, '');

            return apiFetch<AuthResponse>('/auth/login/', {
                method: 'POST',
                body: JSON.stringify({ username, password: data.password }),
            });
        }

        // Telegram WebApp login
        if (data.initData) {
            return apiFetch<AuthResponse>('/auth/telegram/', {
                method: 'POST',
                body: JSON.stringify({ init_data: data.initData }),
            });
        }

        throw new Error('Invalid login data');
    },

    /**
     * Refresh access token
     */
    refreshToken: (refresh: string) => {
        return apiFetch<{ access: string }>('/auth/refresh/', {
            method: 'POST',
            body: JSON.stringify({ refresh }),
        });
    },

    /**
     * Verify INN (Business users)
     */
    verifyInn: (inn: string) => {
        return apiFetch<{ message: string; profile: unknown }>('/auth/verify-inn/', {
            method: 'POST',
            body: JSON.stringify({ inn }),
        });
    }
};
