import type { AppLayoutViewProps } from './types';
import { ThemeProvider } from '../@core';
import styles from './style.module.css';
import '@/assets/styles/fonts.css';
import './style.css';


export const AppLayoutView = ({
  children, id, testID,
}: AppLayoutViewProps) => {
  return (
    <ThemeProvider>
      <div
        id={ id }
        className={ styles.app }
        data-testid={ testID }
      >
        { children }
      </div>
    </ThemeProvider>
  );
}