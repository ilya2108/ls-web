import React from "react";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";
import styled from "styled-components";
import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";
import CustomBanner from "../components/CustomBanner/CustomBanner";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import { useSelector } from "react-redux";
interface ILayoutProps {
  children: React.ReactNode;
}

const Padding = styled.div`
  padding: 40px;
`;

const Layout = ({ children }: ILayoutProps) => {
  const banner = useSelector((state) => state.user.banner);
  return (
    <Page>
      <NavigationProvider>
        {banner ? (
          <CustomBanner icon={<WarningIcon label="" />}>Hello</CustomBanner>
        ) : null}
        <LayoutManager
          globalNavigation={LSGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={ContainerNavigation}
          topOffset={banner ? 52 : 0}
        >
          <PageLayout>
            <Content>
              <Main>
                <Padding>{children}</Padding>
              </Main>
            </Content>
          </PageLayout>
        </LayoutManager>
      </NavigationProvider>
    </Page>
  );
};

export default Layout;