import { Button, Image, Text, View } from '@/ui';
import { ThemeSheet } from '@/ui/@core';
import images from '@/assets/images';


export const IllustratedMessageCard = () => {

  return (
    <View
      theme={ themes.container }
      style={{ maxWidth: '36rem', }}
    >
      <Image
        src={ images.cabinet }
        alt='search illustration'
        theme={ themes.illustration }
      />
      <View theme={ themes.body }>
        <Text variant={{ role: 'heading', }}>Search across your library</Text>
        <Text variant={{ role: 'caption', }}>Bring your sources together and start finding the answers you need</Text>
      </View>
      <View theme={ themes.footer }>
        <Button variant={ variants.button.add }>
          <Text>Add files</Text>
        </Button>
      </View>
    </View>
  );
}


const themes = ThemeSheet.create({
  container: {
    alignItems: 'center',
    margin: 'auto',
    width: {
      compact: 'fluid-4',
      small: 'fluid-3',
    },
    padding: 'relative-2',
    gap: 'relative-8',
  },
  illustration: {
    width: {
      compact: 'fluid-6',
      small: 'fluid-5',
      regular: 'fluid-3',
    },
  },
  body: {
    alignItems: 'center',
    gap: 'relative-2',
    textAlign: 'center',
  },
  footer: {
    width: {
      compact: 'fluid-5',
      small: 'fluid-2',
      regular: 'fluid-1',
    },
  },
});


const variants = ThemeSheet.variants.lucidMoonsong({
  button: {
    add: {
      fill: 'tonal',
      fit: 'fluid-6',
      radius: '2xl',
    },
  },
});
