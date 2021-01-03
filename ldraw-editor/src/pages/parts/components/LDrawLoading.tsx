import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLDraw } from 'react-ldraw';

const LDrawLoading = (): ReactElement | null => {
  const ldraw = useLDraw();
  const [filename, setFilename] = useState<string>();

  useEffect(() => {
    const listener = (value: string) => {
      setFilename(value);
    };
    ldraw.subscribe(listener);
    return () => {
      ldraw.unsubscribe(listener);
    };
  }, [ldraw]);

  return <div>{filename}</div>;
};

export default LDrawLoading;
