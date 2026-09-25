import { PageLayoutView, SxStyles, } from '@/ui';


export const Home = () => {
  return (
    <PageLayoutView sx={ sxStyles.container }>
    </PageLayoutView>
  )
}


const sxStyles = SxStyles.create({
  container: {
    width: 'fill',
    height: 'fill',
    backgroundColor: 'base',
  },
});
