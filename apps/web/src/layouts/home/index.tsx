import { Button, Image, PageView, ThemeSheet, View, } from '@/ui';
import { Ellipsis, Menu } from '@/ui/@icons';
import images from '@/assets/images';


export const Home = () => {
  return (
    <PageView theme={ theme.container }>

      <PageView.Toolbar
        alignment='top'
        theme={ theme.header }
      >
        <PageView.Toolbar.Slot alignment='start'>
          <Button variant={ variants.button.header }>
            <Button.Icon icon={ Menu }/>
          </Button>
        </PageView.Toolbar.Slot>
        <Image
          src={ images.tuesday_logo }
          theme={ theme.logo }
          alt='Tuesday logo'
        />
        <PageView.Toolbar.Slot alignment='end'>
          <Button variant={ variants.button.header }>
            <Button.Icon icon={ Ellipsis }/>
          </Button>
        </PageView.Toolbar.Slot>
      </PageView.Toolbar>

      <View theme={ theme.content }></View>

      <PageView.Toolbar alignment='bottom'></PageView.Toolbar>

    </PageView>
  );
}


const theme = ThemeSheet.create({
  container: { backgroundColor: 'base', },
  header: {
    padding: 'relative-3',
    paddingVertical: 'relative-2',
  },
  content: { flex: 'auto', },
  logo: {
    width: 'relative-6',
    height: 'relative-6',
  },
});


const variants = ThemeSheet.variants.lucidMoonsong({
  button: {
    header: {
      radius: '2xl',
      glass: { interactive: true, },
    },
  },
});
