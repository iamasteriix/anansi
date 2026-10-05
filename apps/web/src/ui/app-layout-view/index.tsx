import type { AppLayoutViewProps } from './types';
import { ThemeProvider } from '../theme';
import styles from './style.module.css';
import '@/assets/styles/fonts.css';
import './style.css';


export const AppLayoutView = ({
  children, id, testID,
}: AppLayoutViewProps) => {
  return (
    <div
      id={ id }
      className={ styles.app }
      data-testid={ testID }
    >
      <ThemeProvider>
        { children }
      </ThemeProvider>
    </div>
  );
}