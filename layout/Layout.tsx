import React, { Fragment } from "react";
import styled from "styled-components";
import Head from "../components/Head/Head";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import LSFlagGroup from "../components/LSFlagGroup/LSFlagGroup";
import Navigation from "../components/Navigation/Navigation";
import SearchDrawer from "../components/Drawer/SearchDrawer"

interface ILayoutProps {
  title?: string,
  children: React.ReactNode
}

const Padding = styled.div`
  padding: 0 40px 0 40px;
`;

const Layout = ({ title, children }: ILayoutProps) => (
  <Fragment>
    <Head title={title}/>
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
  </Fragment>
);

export default Layout;