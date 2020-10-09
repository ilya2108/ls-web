import { useState } from "react";
import { Profile as AKProfile } from "@atlaskit/atlassian-navigation";
import PersonIcon from "@atlaskit/icon/glyph/person";
import Popup from "@atlaskit/popup";
import { MenuGroup, Section, ButtonItem, LinkItem } from "@atlaskit/menu";
import { useRouter } from "next/router";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen((state) => !state)}
      placement="bottom-start"
      content={() => (
        <MenuGroup>
          <Section>
          <LinkItem href="/ProfilePage" isSelected={router.pathname === "/ProfilePage"}>Profile</LinkItem>
          </Section>
          <Section hasSeparator>
            <ButtonItem onClick={() => console.log("Log out!")}>Log Out</ButtonItem>
          </Section>
        </MenuGroup>
      )}
      trigger={(triggerProps) => (
        <AKProfile
          {...triggerProps}
          icon={<PersonIcon label="Person Icon" />}
          onClick={() => setIsOpen((value) => !isOpen)}
          tooltip="Your profile and settings"
          isSelected={isOpen}
        />
      )}
    />
  );
};

export default Profile;