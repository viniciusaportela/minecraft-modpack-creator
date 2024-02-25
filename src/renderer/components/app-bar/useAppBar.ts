import React from 'react';

interface AppBarContextProps {
  title: string;
  setTitle: (title: string) => void;
  goBack: (() => void) | null;
  setGoBack: (goBack: (() => void) | null) => void;
}

export const AppBarContext = React.createContext<AppBarContextProps>({
  title: 'My Projects',
  setTitle: () => {},
  goBack: null,
  setGoBack: () => {},
});

export const useAppBar = () => {
  return React.useContext(AppBarContext);
};
