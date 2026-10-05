import {
  Button, GlassButton, GlassTextField, Image, PageLayoutView, Pressable, Toolbar, View,
} from '@/ui';
import { SxStyles } from '@/ui/core';
import { Ellipsis, Plus, Search, } from '@/ui/icons';
import images from '@/assets/images';


export const Home = () => {
  return (
    <PageLayoutView sx={ sxStyles.container }>

      <PageLayoutView.Header>
        <Toolbar sx={ sxStyles.header }>
          <Toolbar.Anchor position='leading'>
            <Pressable>
              <Image
                src={ images.tuesday_logo }
                alt='Tuesday logo'
                sx={ sxStyles.logo }
              />
            </Pressable>
          </Toolbar.Anchor>
          <Toolbar.Anchor position='trailing'>
            <GlassButton variant={ variants.glassButton.more }>
              <GlassButton.Icon
                icon={ Ellipsis }
              />
            </GlassButton>
          </Toolbar.Anchor>
        </Toolbar>
      </PageLayoutView.Header>

      <View
        variant={ variants.view.contents }
        sx={ sxStyles.contents }
      ></View>
      
      <PageLayoutView.Footer sx={ sxStyles.footer }>
        <GlassTextField
          sx={ sxStyles.search }
          placeholder='Search'
        >
          <GlassTextField.Icon icon={ Search }/>
          <GlassTextField.Trailing>
            <Button variant={ variants.button.add }>
              <Button.Icon
                icon={ Plus }
              />
            </Button>
          </GlassTextField.Trailing>
        </GlassTextField>
      </PageLayoutView.Footer>
    </PageLayoutView>
  );
}


const variants = SxStyles.variants({
  view: {
    contents: {
      fill: 'base',
    },
  },
  button: {
    add: {
      intent: 'primary',
      radius: '2xl',
    },
  },
  glassButton: {
    more: {
      radius: '2xl',
    },
  },
});


const sxStyles = SxStyles.create({
  container: {
    width: 'fill',
    height: 'fill',
    backgroundColor: 'base',
  },
  contents: {
    flex: 'auto',
  },
  header: {
    paddingHorizontal: 'space-3',
    paddingVertical: 'space-1',
  },
  logo: {
    width: 'space-6',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 'space-1',
    paddingHorizontal: 'space-1',
    paddingBottom: 'space-5',
  },
  search: {
    width: {
      regular: 'auto',
      large: 'half',
    },
  },
});
