import type { ElementProps } from '../@core';
import { ThemeProvider, ViewElement, } from '../@core';
import styles from './style.module.css';
import '@/assets/styles/fonts.css';
import './style.css';


export const AppView = ({
  children, id, theme, style, a11y, testID,
}: ElementProps) => {
  return (
    <ThemeProvider>
      <ViewElement
        classes={ styles['app-view'] }
        theme={ theme }
        style={ style }
        a11y={ a11y }
        testID={ testID }
        id={ id }
      >
        { children }
      </ViewElement>
    </ThemeProvider>
  );
}