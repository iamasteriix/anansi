import type { PageLayoutViewProps } from './types';
import { View } from '../view';
import styles from './index.module.css';


export const PageLayoutView = ({
  children, style, sx, a11y, testID, ref,
}: PageLayoutViewProps) => {
  return (
    <div className={ styles.page }>
      <View
        sx={ sx }
        style={ style }
        a11y={ a11y }
        data-component='page-layout-view'
        testID={ testID }
        ref={ ref }
      >
        { children }
      </View>
    </div>
  );
}
