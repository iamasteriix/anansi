import type { PageLayoutViewProps } from './types';
import { View } from '../view';
import { getContentOrdering } from './utils';
import { PageLayoutHeader, PageLayoutFooter } from './slots';
import styles from './style.module.css';


export const PageLayoutView = ({
  children, id, sx, style, a11y, testID, ref,
}: PageLayoutViewProps) => {

  const { header, footer, content, } = getContentOrdering(children);

  return (
    <div className={ styles.container }>
      <View
        id={ id }
        sx={ sx }
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minBlockSize: 0,
          ...style,
        }}
        a11y={ a11y }
        testID={ testID }
        ref={ ref }
      >
        <div className={ styles.header }>
          { header }
        </div>
        <View
          sx={{
            flex: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          { content }
        </View>
        <div className={ styles.footer }>
          { footer }
        </div>
      </View>
    </div>
  );
};

PageLayoutView.Header = PageLayoutHeader;
PageLayoutView.Footer = PageLayoutFooter;
