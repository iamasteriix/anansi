import { Button, Image, PageView, TextField, ThemeSheet, View, } from '@/ui';
import { Ellipsis, Menu, Plus, Search } from '@/ui/@icons';
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

      <PageView.Toolbar
        alignment='bottom'
        theme={ theme.docker }
        style={{ maxWidth: '45rem', }}
      >
        <TextField
          variant={ variants.textfield.searchbox }
          label='Search'
        >
          <TextField.Button variant={ variants.button.upload }>
            <TextField.Button.Icon icon={ Plus }/>
          </TextField.Button>
          <TextField.Input
            placeholder='Search'
          />
          <TextField.Icon
            icon={ Search }
            alignment='end'
          />
        </TextField>
      </PageView.Toolbar>

    </PageView>
  );
}


const theme = ThemeSheet.create({
  container: { backgroundColor: 'base', },
  header: {
    paddingHorizontal: 'relative-3',
    paddingVertical: 'relative-2',
    gap: 'relative-2',
  },
  content: { flex: 'auto', },
  logo: {
    width: 'relative-6',
    height: 'relative-6',
  },
  docker: {
    marginHorizontal: 'auto',
    marginBottom: {
      compact: 'relative-1',
      regular: 'relative-3',
    },
    paddingHorizontal: 'relative-1',
    width: {
      compact: 'fluid-6',
      regular: 'fluid-3',
      large: 'fluid-3',
    },
  },
});


const variants = ThemeSheet.variants.lucidMoonsong({
  button: {
    header: {
      radius: '2xl',
      glass: { interactive: true, },
    },
    upload: {
      fill: 'ghost',
      radius: '2xl',
      size: 'sm',
    },
  },
  textfield: {
    searchbox: {
      radius: '2xl',
      glass: true,
      elevation: 'raised',
    },
  },
});
