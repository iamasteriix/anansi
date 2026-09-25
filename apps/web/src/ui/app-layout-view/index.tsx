import type { AppLayoutViewProps } from './types';
import { ThemeProvider } from '../theme';
import styles from './index.module.css';
import '@/assets/styles/fonts.css';
import './index.css';


export const AppLayoutView = ({
  children,
}: AppLayoutViewProps) => {
  return (
    <div className={ styles.app }>
      <ThemeProvider>
        { children }
      </ThemeProvider>
    </div>
  );
}