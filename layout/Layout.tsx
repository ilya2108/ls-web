import React from "react";
import styled from "styled-components";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import LSFlagGroup from "../components/LSFlagGroup/LSFlagGroup";
import Navigation from "../components/Navigation/Navigation";
import SearchDrawer from "../components/Drawer/SearchDrawer"

interface ILayoutProps {
  children: React.ReactNode;
}

const Padding = styled.div`
  padding: 0 40px 0 40px;
`;

const Layout = ({ children }: ILayoutProps) => (
  <div>
    <LSFlagGroup />
    <Navigation />
    <SearchDrawer />
    <PageLayout>
      <Content>
        <Main>
          <Padding>{children}</Padding>
        </Main>
      </Content>
    </PageLayout>
  </div>
);

export default Layout;