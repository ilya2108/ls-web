import React from "react";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";
import styled from "styled-components";
import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";
import CustomBanner from "../components/CustomBanner/CustomBanner";
import { useSelector, useDispatch } from "react-redux";
import { closeBanner } from "../modules/core/redux/banner/banner.actions";
interface ILayoutProps {
  children: React.ReactNode;
}

const Padding = styled.div`
  padding: 40px;
`;

const Layout = ({ children }: ILayoutProps) => {
  const { showBanner } = useSelector((state) => state.banner);
  const dispatch = useDispatch();
  const dispatchCloseBanner = () => dispatch(closeBanner());

  const bannerTTL = 1800;

  showBanner ? setTimeout(() => dispatchCloseBanner(), bannerTTL) : null;

  return (
    <Page>
      <NavigationProvider>
        <CustomBanner />
        <LayoutManager
          globalNavigation={LSGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={ContainerNavigation}
          topOffset={showBanner ? 52 : 0}
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