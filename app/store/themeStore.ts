import { create } from 'zustand';

export interface Theme {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
}

export const lightTheme: Theme = {
    primary: '#1F73C6',
    secondary: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
};

export const darkTheme: Theme = {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
};

interface ThemeState {
    isDark: boolean;
    theme: Theme;
    toggleTheme: () => void;
}


export const useThemeStore = create<ThemeState>((set) => ({
    isDark: false,
    theme: lightTheme,
    toggleTheme: () =>
        set((state) => ({
            isDark: !state.isDark,
            theme: state.isDark ? lightTheme : darkTheme,
        })),
}));