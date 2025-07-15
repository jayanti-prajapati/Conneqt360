import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { useTheme as useNavTheme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#ffffff',
    card: '#ffffff',
    text: '#1c1c1e',
    border: '#d1d1d6',
    notification: '#ff3b30',
  },
};

const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0a84ff',
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    border: '#38383a',
    notification: '#ff453a',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // Sync with system theme changes
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
    // You might want to persist this preference to AsyncStorage
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
