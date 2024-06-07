import React, {
  Children,
  FunctionComponent,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

interface IPagerProps extends PropsWithChildren {
  titleElement?: FunctionComponent<{ title: string }>;
  initialPage: string;
  titleByPage?: Record<string, string | null>;
  page?: string;
  onPageChange?: (page: string) => void;
}

interface IPagerContext {
  page: string;
  navigate: (page: string) => void;
  setTitle: (title: string) => void;
}

export const PagerContext = React.createContext<IPagerContext>({
  page: '',
  navigate: () => {},
  setTitle: () => {},
});

export function Pager({
  titleElement,
  titleByPage,
  initialPage,
  children,
  page,
  onPageChange,
}: IPagerProps) {
  const [internalPage, setInternalPage] = useState(initialPage);
  const [title, setTitle] = useState(titleByPage?.[initialPage] ?? '');

  const navigateWithMiddleware = (pg: string) => {
    const fn = onPageChange ?? setInternalPage;
    setTitle(titleByPage?.[pg] ?? '');
    fn(pg);
  };

  const contextValue = useMemo(
    () => ({
      page: page ?? internalPage,
      navigate: navigateWithMiddleware,
      setTitle,
    }),
    [page, onPageChange, internalPage],
  );

  const shownPage = useMemo(() => {
    const childrenArray = Children.toArray(children);
    const pageToRender = childrenArray.find(
      (child) =>
        (child as any).props?.name === contextValue.page &&
        (child as any).type?.displayName === 'Page',
    );

    return pageToRender ?? childrenArray[0];
  }, [contextValue.page]);

  return (
    <PagerContext.Provider value={contextValue}>
      {titleElement && titleElement({ title })}
      {shownPage}
    </PagerContext.Provider>
  );
}

export function Page({ children }: PropsWithChildren<{ name: string }>) {
  return children;
}

Page.displayName = 'Page';
