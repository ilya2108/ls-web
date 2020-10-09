import { ProductHome as AKProductHome } from "@atlaskit/atlassian-navigation";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";

const ProductHome = () => (
  <AKProductHome
    icon={ReposIcon}
    logo={ReposIcon}
    href="/"
    siteTitle="Learn Shell 2.0"
  />
);

export default ProductHome;