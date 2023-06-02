import { LoadingScreen, Layout, EmptyScreen } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";

import starterImage from "../assets/starter.png";

function Root() {
  const { init } = useOdeClient();

  if (!init) return <LoadingScreen position={false} />;

  return init ? (
    <Layout style={{ justifyContent: "center" }}>
      <EmptyScreen
        imageSrc={starterImage}
        imageAlt=""
        title="Start your new application!"
        text="Create a new file in src/app folder with the name of your app (e.g: Blog) and replace the content inside <Layout> with your own component."
      />
    </Layout>
  ) : null;
}

export default Root;
