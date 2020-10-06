import React from "react";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";
import styled from "styled-components";

import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";

import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";

interface IProps {
  children: React.ReactNode;
}

const Padding = styled.div`
  padding: 40px;
`;

const Layout = ({ children }: IProps) => (
  <Page>
    <NavigationProvider>
      <LayoutManager
        globalNavigation={LSGlobalNavigation}
        productNavigation={() => null}
        containerNavigation={ContainerNavigation}
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

export default Layout;
