import * as React from "react";
import { useIsTouchDevice } from "./use-is-touch-device";

type MobileContextType = {
  isMobile: boolean;
  isLowTierGPU: boolean;
  isTouchDevice: boolean;
};

const MobileContext = React.createContext<MobileContextType>({
  isMobile: false,
  isLowTierGPU: false,
  isTouchDevice: false,
});

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const isTouchDevice = useIsTouchDevice();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLowTierGPU, setIsLowTierGPU] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    // Basic heuristic for low tier GPU/CPU
    const cores = navigator.hardwareConcurrency || 4;
    setIsLowTierGPU(isTouchDevice && cores <= 4);

    return () => window.removeEventListener("resize", handleResize);
  }, [isTouchDevice]);

  return (
    <MobileContext.Provider value={{ isMobile, isLowTierGPU, isTouchDevice }}>
      {children}
    </MobileContext.Provider>
  );
}

export const useMobile = () => React.useContext(MobileContext);
