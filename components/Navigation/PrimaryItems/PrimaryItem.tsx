import { PrimaryButton } from "@atlaskit/atlassian-navigation";

import { useRouter } from "next/router";

interface IPrimaryItemProps {
  href?: string,
  children: string
}

const PrimaryItem = ({ href, children }: IPrimaryItemProps) => {
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