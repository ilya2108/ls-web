import {
  AtlassianNavigation,
  Create,
  Help as AKHelp,
} from "@atlaskit/atlassian-navigation";
import PrimaryItems from "./PrimaryItems/PrimaryItems";
import ProductHome from "./SecondaryItems/ProductHome";
import Profile from "./SecondaryItems/Profile";
import Search from "./SecondaryItems/Search";
import Settings from "./SecondaryItems/Settings";
import Notifications from "./SecondaryItems/Notifications";

const Navigation = () => (
  <AtlassianNavigation
    label="Navigation"
    primaryItems={PrimaryItems}
    renderProductHome={ProductHome}
    renderHelp={() => <AKHelp tooltip="Get help!" />}
    renderProfile={Profile}
    renderSearch={Search}
    renderSettings={Settings}
    renderNotifications={Notifications}
  />
);

export default Navigation;