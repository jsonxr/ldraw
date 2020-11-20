import React, {
  ReactNode,
  ReactElement,
  createContext,
  useContext,
  useState,
} from 'react';
import { LDraw } from 'ldraw';

const defaultLDraw = new LDraw();

const LDrawContext = createContext<LDraw>(defaultLDraw);
export const useLDraw = (): LDraw => useContext(LDrawContext);

export interface LDrawProviderProps {
  children: ReactNode;
  ldraw?: LDraw;
}

export const LDrawProvider = ({
  children,
  ldraw,
}: LDrawProviderProps): ReactElement => {
  const [lDraw] = useState(ldraw ?? defaultLDraw);
  return (
    <LDrawContext.Provider value={lDraw}>{children}</LDrawContext.Provider>
  );
};
