import {
  createContext,
  useContext,
  ReactNode,
  useRef,
  RefObject,
  useState,
  useEffect, SetStateAction, Dispatch,
} from "react";

export interface VideoContextType {
  videoRef: RefObject<HTMLVideoElement | null>;
  initialized: boolean;
  setInitialized: Dispatch<SetStateAction<boolean>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [initialized, setInitialized] = useState(false);

  // useEffect(() => {
  //   if (videoRef.current && !initialized) {
  //     setInitialized(true);
  //     console.log('initialized:::', videoRef.current);
  //   }
  // }, [videoRef.current, initialized]);

  return (
    <VideoContext.Provider value={{ videoRef, initialized, setInitialized }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within useVideoProvider");
  }
  return context;
};
