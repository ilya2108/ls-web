import {
  AtlassianNavigation,
  Create,
  Help,
  Profile,
  Search,
  Settings,
  Notifications,
} from "@atlaskit/atlassian-navigation";
import { NotificationIndicator } from "@atlaskit/notification-indicator";
import { ProductHome } from "@atlaskit/atlassian-navigation";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";
import PersonIcon from "@atlaskit/icon/glyph/person";
import PrimaryItems from "./PrimaryItems";
import { useDispatch } from "react-redux";
import {openSearchDrawer} from "../../modules/core/redux/drawer/drawer.actions";

const LSProductHome = () => (
  <ProductHome
    icon={ReposIcon}
    logo={ReposIcon}
    href="/"
    siteTitle="Learn Shell 2.0"
  />
);

const DefaultProfile = () => (
  <Profile
    icon={<PersonIcon label="" />}
    onClick={() => console.log("Profile button!")}
    tooltip="Your profile and settings"
  />
);

const DefaultSearch = () => {
  const dispatch = useDispatch();
  const dispatchOpenSearchDrawer = () => dispatch(openSearchDrawer());
  
  return (
  <Search
    onClick={() => dispatchOpenSearchDrawer()}
    placeholder="Search..."
    tooltip="Search"
    label="Search"
  />
);}

const DefaultSettings = () => <Settings tooltip="Product settings" />;

const NotificationsBadge = () => (
  <NotificationIndicator
    onCountUpdated={() => console.log("Notification count updated!")}
    notificationLogProvider={Promise.resolve({}) as any}
  />
);

const LSNavigation = () => (
  <AtlassianNavigation
    label="Navigation"
    primaryItems={PrimaryItems}
    renderProductHome={LSProductHome}
    renderHelp={() => <Help tooltip="Get help!" />}
    renderProfile={DefaultProfile}
    renderSearch={DefaultSearch}
    renderSettings={DefaultSettings}
    renderNotifications={() => (
      <Notifications badge={NotificationsBadge} tooltip="Notifications" />
    )}
  />
);

export default LSNavigation;