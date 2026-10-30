import { Image, Press, Text, View } from '@/ui';
import { ThemeSheet } from '@/ui/@core';
import images from '@/assets/images';


export const DrawerContent = () => {
  return (
    <View theme={ theme.footer }>
      <ProfileCard/>
    </View>
  );
}


const ProfileCard = () => {
  return (
    <Press theme={ theme.footerCard }>
      <Image
        src={ images.avatar_fallback }
        alt='avatar'
        theme={ theme.avatar }
      />
      <Text>Sign in</Text>
    </Press>
  );
}


const theme = ThemeSheet.create({
  footer: {
    width: 'fluid-6',
    marginTop: 'auto',
    padding: 'relative-1',
    bottom: '0px',
  },
  footerCard: {
    flexDirection: 'row',
    padding: 'relative-2',
    gap: 'relative-2',
    borderRadius: '2xl',
  },
  avatar: {
    width: 'relative-8',
    height: 'relative-8',
    borderRadius: '2xl',
  },
});
