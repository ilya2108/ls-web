import { useState } from "react";
import { useRouter } from "next/router";
import Popup from "@atlaskit/popup";
import {
  PrimaryButton,
  PrimaryDropdownButton,
} from "@atlaskit/atlassian-navigation";

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
      content={() =>
        items.map(({ link, text, action }, id) => (
          <PrimaryButton
            key={id}
            isHighlighted={router.pathname === link}
            onClick={link ? () => redirect(link) : action}
          >
            {text}
          </PrimaryButton>
        ))
      }
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