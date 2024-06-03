import { PropsWithChildren } from 'react';
import { UserProvider } from './Usercontext';

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

export default Providers;
