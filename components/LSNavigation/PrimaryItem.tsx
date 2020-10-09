import { PrimaryButton } from "@atlaskit/atlassian-navigation";

import { useRouter } from "next/router";

const PrimaryItem = ({ href, children }) => {
  const router = useRouter();

  const redirect = (link) => router.push(link);

  return (
    <PrimaryButton
      isHighlighted={router.pathname === href}
      onClick={() => redirect(href)}
    >
      {children}
    </PrimaryButton>
  );
};

export default PrimaryItem;