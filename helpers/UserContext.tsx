import { createContext } from 'react';

interface ContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (state: boolean) => void;
};
const UserContext = createContext<Partial<ContextProps>>({});

export default UserContext;