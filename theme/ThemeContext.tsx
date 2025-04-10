import React, { 
    createContext, 
    useState, 
    useContext,
    ReactNode 
} from 'react';
import { Appearance } from 'react-native';

const defaultTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    highlight: string;
    subtle: string;
    border: string;
  };
}

const defaultColors = {
  primary: '#CA8E82',  
  secondary: '#F2D6CE',  
  background: '#F2E7DD', 
  text: '#292421',      
  accent: '#BAEODA',  
  highlight: '#A75F37', 
  subtle: '#F2D6CE',   
  border: '#CA8E82',  
};

const darkColors = {
  primary: '#CA8E82',  
  secondary: '#A75F37', 
  background: '#292421', 
  text: '#F2E7DD',     
  accent: '#BAEODA',   
  highlight: '#F2D6CE',  
  subtle: '#7A958F',   
  border: '#CA8E82',  
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: defaultColors,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? defaultColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
