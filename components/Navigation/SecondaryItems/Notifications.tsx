import { Notifications as AKNotifications } from "@atlaskit/atlassian-navigation";
import { NotificationIndicator } from "@atlaskit/notification-indicator";

const NotificationsBadge = () => (
  <NotificationIndicator
    onCountUpdated={() => console.log("Notification count updated!")}
    notificationLogProvider={Promise.resolve({}) as any}
  />
);

const Notifications = () => (
  <AKNotifications badge={NotificationsBadge} tooltip="Notifications" />
);

export default Notifications;