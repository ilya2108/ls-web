import { PrimaryButton } from "@atlaskit/atlassian-navigation";

import { useRouter } from "next/router";

const PrimaryItem = ({ href, children }) => {
  const router = useRouter();

  const redirect = (link) => router.push(link);
  const shouldHighlight = (stringToCompare) =>
    router.pathname.toLocaleLowerCase().includes(stringToCompare.toLowerCase());

  return (
    <PrimaryButton
      isHighlighted={shouldHighlight(children)}
      onClick={() => redirect(href)}
    >
      {children}
    </PrimaryButton>
  );
};

export default PrimaryItem;