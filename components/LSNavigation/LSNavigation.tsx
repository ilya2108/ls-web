import { AtlassianNavigation } from "@atlaskit/atlassian-navigation";
import { ProductHome } from "@atlaskit/atlassian-navigation";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";

const LSProductHome = () => (
  <ProductHome
    icon={ReposIcon}
    logo={ReposIcon}
    href="/"
    siteTitle="Learn Shell 2.0"
  />
);

const LSNavigation = () => (
  <AtlassianNavigation
    label="Navigation"
    primaryItems={[]}
    renderProductHome={LSProductHome}
  />
);

export default LSNavigation;