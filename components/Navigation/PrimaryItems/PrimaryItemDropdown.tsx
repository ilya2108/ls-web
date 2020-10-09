import { useState } from "react";
import { useRouter } from "next/router";
import Popup from "@atlaskit/popup";
import { PrimaryDropdownButton } from "@atlaskit/atlassian-navigation";
import { MenuGroup, Section, ButtonItem, LinkItem } from "@atlaskit/menu";

const PrimaryItemDropdown = (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { items, title, path } = props.dropdownItems;

  const redirect = (link) => router.push(link);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen((state) => !state)}
      placement="bottom-start"
      content={() => {
        return (
          <MenuGroup>
            <Section>
              {items.map(({ link, text, action }, id) => (
                <ButtonItem
                  key={id}
                  isSelected={router.pathname === link}
                  onClick={link ? () => redirect(link) : action}
                >
                  {text}
                </ButtonItem>
              ))}
            </Section>
          </MenuGroup>
        );
      }}
      trigger={(triggerProps) => (
        <PrimaryDropdownButton
          isHighlighted={router.pathname === path}
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen((state) => !state)}
        >
          {title}
        </PrimaryDropdownButton>
      )}
    />
  );
};

export default PrimaryItemDropdown;