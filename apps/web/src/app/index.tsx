import { AppView, Drawer } from '@/ui';
import { Home } from '@/layouts';
import { useState } from 'react';
import { DrawerContent } from '@/components';


export const App = () => {

  const [open, setOpen] = useState(false);

  return (
    <AppView>
      <Drawer
        open={ open }
        onOpen={ () => setOpen(true) }
        onClose={ () => setOpen(false) }
        drawerType='back'
        drawerWidth={ 270 }
      >
        <Drawer.Content theme={{ height: 'fluid-6', }}>
          <DrawerContent/>
        </Drawer.Content>
        <Home openDrawer={ () => setOpen(!open) }/>
      </Drawer>
    </AppView>
  );
}
