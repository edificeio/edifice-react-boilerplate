import { LoadingScreen, useEdificeClient, PageLayout } from '@edifice.io/react';

/** Check old format URL and redirect if needed */
export const loader = async () => {
  return null;
};

export const Root = () => {
  const { init } = useEdificeClient();

  if (!init) return <LoadingScreen position={false} />;

  return init ? (
    <PageLayout>
      <PageLayout.Header />
      Boilerplate
    </PageLayout>
  ) : null;
};

export default Root;
