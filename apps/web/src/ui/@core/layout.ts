import type { Chrome } from './types';
import { createContext, useContext, } from 'react';


// CHROME ===============================================================================
export const ChromeContext = createContext<Chrome>({});


export const useChrome = (): Chrome => {
  const values = useContext(ChromeContext);
  if (!values) throw new Error('invalid Chrome');
  return values;
}
// ======================================================================================
