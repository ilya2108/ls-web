import {
  AtlassianNavigation,
  Create,
  Help as AKHelp,
  Profile as AKProfile,
  Search as AKSearch,
  Settings as AKSettings,
  Notifications as AKNotifications,
  ProductHome as AKProductHome
} from "@atlaskit/atlassian-navigation";
import { NotificationIndicator } from "@atlaskit/notification-indicator";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";
import PersonIcon from "@atlaskit/icon/glyph/person";
import PrimaryItems from "./PrimaryItems";
import { useDispatch } from "react-redux";
import {openSearchDrawer} from "../../modules/core/redux/drawer/drawer.actions";

const ProductHome = () => (
  <AKProductHome
    icon={ReposIcon}
    logo={ReposIcon}
    href="/"
    siteTitle="Learn Shell 2.0"
  />
);

const Profile = () => (
  <AKProfile
    icon={<PersonIcon label="" />}
    onClick={() => console.log("Profile button!")}
    tooltip="Your profile and settings"
  />
);

const Search = () => {
  const dispatch = useDispatch();
  const dispatchOpenSearchDrawer = () => dispatch(openSearchDrawer());
  
  return (
  <AKSearch
    onClick={() => dispatchOpenSearchDrawer()}
    placeholder="Search..."
    tooltip="Search"
    label="Search"
  />
);}

const Settings = () => <AKSettings tooltip="Product settings" />;

const NotificationsBadge = () => (
  <NotificationIndicator
    onCountUpdated={() => console.log("Notification count updated!")}
    notificationLogProvider={Promise.resolve({}) as any}
  />
);

const Navigation = () => (
  <AtlassianNavigation
    label="Navigation"
    primaryItems={PrimaryItems}
    renderProductHome={ProductHome}
    renderHelp={() => <AKHelp tooltip="Get help!" />}
    renderProfile={Profile}
    renderSearch={Search}
    renderSettings={Settings}
    renderNotifications={() => (
      <AKNotifications badge={NotificationsBadge} tooltip="Notifications" />
    )}
  />
);

export default Navigation;