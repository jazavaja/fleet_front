import { createContext, useContext, useState } from 'react';

const RequestProgressContext = createContext<{
  loading: boolean;
  show: () => void;
  hide: () => void;
}>({
  loading: false,
  show: () => {},
  hide: () => {},
});

export const RequestProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const show = () => setLoading(true);
  const hide = () => setLoading(false);

  return (
    <RequestProgressContext.Provider value={{ loading, show, hide }}>
      {children}
    </RequestProgressContext.Provider>
  );
};

export const useRequestProgress = () => useContext(RequestProgressContext);
