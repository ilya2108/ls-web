import { Profile as AKProfile } from "@atlaskit/atlassian-navigation";
import PersonIcon from "@atlaskit/icon/glyph/person";

const Profile = () => (
  <AKProfile
    icon={<PersonIcon label="Person Icon" />}
    onClick={() => console.log("Profile button!")}
    tooltip="Your profile and settings"
  />
);

export default Profile;