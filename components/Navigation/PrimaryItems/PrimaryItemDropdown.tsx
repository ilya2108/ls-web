import { useState } from "react";
import { useRouter } from "next/router";
import Popup from "@atlaskit/popup";
import { PrimaryDropdownButton } from "@atlaskit/atlassian-navigation";
import { MenuGroup, Section, ButtonItem } from "@atlaskit/menu";

export type itemsType = {
  label: string;
  link?: string;
  action?: any;
};

export type dropdownItemsType = {
  title: string;
  items: Array<itemsType>;
};
interface IPrimaryItemDropdown {
  dropdownItems: dropdownItemsType;
}

const PrimaryItemDropdown = ({ dropdownItems }: IPrimaryItemDropdown) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { items, title } = dropdownItems;

  const redirect = (link) => router.push(link);
  const shouldHighlight = (stringToCompare) =>
    router.pathname.toLocaleLowerCase().includes(stringToCompare.toLowerCase());

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen((state) => !state)}
      placement="bottom-start"
      content={() => {
        return (
          <MenuGroup>
            <Section>
              {items.map(({ link, label, action }, id) => (
                <ButtonItem
                  key={id}
                  isSelected={link ? shouldHighlight(link) : false}
                  onClick={link ? () => redirect(link) : action}
                >
                  {label}
                </ButtonItem>
              ))}
            </Section>
          </MenuGroup>
        );
      }}
      trigger={(triggerProps) => (
        <PrimaryDropdownButton
          isHighlighted={shouldHighlight(title)}
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