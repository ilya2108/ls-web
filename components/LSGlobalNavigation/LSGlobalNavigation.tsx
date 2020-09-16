// documentation
// https://atlaskit.atlassian.com/packages/design-system/navigation-next

// dependencies
import React from "react";
import GlobalNavigation from "@atlaskit/global-navigation";

// components
import SearchDrawer from "../Drawer/SearchDrawer";
import CreateDrawer from "../Drawer/CreateDrawer";

// ICONS
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";

interface ILSGlobalNavigationState {
  isSearchDrawerOpen: boolean;
  shouldUnmountOnExit: boolean;
  isSearchDrawerFocusLockEnabled: boolean;
  unmountOnExit: boolean;
  isCreateDrawerOpen: boolean;
  isCreateDrawerFocusLockEnabled: boolean;
};

class LSGlobalNavigation extends React.Component<{}, ILSGlobalNavigationState> {
  state: ILSGlobalNavigationState = {
    isSearchDrawerOpen: false,
    shouldUnmountOnExit: false,
    isSearchDrawerFocusLockEnabled: true,
    unmountOnExit: true,
    isCreateDrawerOpen: false,
    isCreateDrawerFocusLockEnabled: true,
  };

  // Search drawer methods
  openSearchDrawer = () => this.setState({ isSearchDrawerOpen: true });

  closeSearchDrawer = () => {
    this.setState({ isSearchDrawerOpen: false });
  };

  // Create drawer methods
  openCreateDrawer = () => this.setState({ isCreateDrawerOpen: true });

  closeCreatehDrawer = () => {
    this.setState({ isCreateDrawerOpen: false });
  };

  // Universal methods
  onCloseComplete = (node) => console.log("onCloseComplete", node);

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: unmountOnExitValue }) => ({
      shouldUnmountOnExit: !unmountOnExitValue,
    }));
  };

  render() {
    const {
      isSearchDrawerOpen,
      unmountOnExit,
      isSearchDrawerFocusLockEnabled,
      isCreateDrawerOpen,
      isCreateDrawerFocusLockEnabled,
    } = this.state;

    return (
      <GlobalNavigation
        productIcon={() => <ReposIcon label="" size="xlarge" />}
        productHref="#"
        productTooltip="Learnshell 2.0"
        // Search Drawer
        onSearchClick={this.openSearchDrawer}
        searchTooltip="Search"
        isSearchDrawerOpen={isSearchDrawerOpen}
        searchDrawerContents={SearchDrawer}
        onSearchDrawerClose={this.closeSearchDrawer}
        onSearchDrawerCloseComplete={this.onCloseComplete}
        shouldSearchDrawerUnmountOnExit={unmountOnExit}
        isSearchDrawerFocusLockEnabled={isSearchDrawerFocusLockEnabled}
        searchDrawerWidth="medium"
        // Create Drawer
        onCreateClick={this.openCreateDrawer}
        createTooltip="Create"
        isCreateDrawerOpen={isCreateDrawerOpen}
        createDrawerContents={CreateDrawer}
        onCreateDrawerClose={this.closeCreatehDrawer}
        onCreateDrawerCloseComplete={this.onCloseComplete}
        shouldCreateDrawerUnmountOnExist={unmountOnExit}
        isCreateDrawerFocusLockEnabled={isCreateDrawerFocusLockEnabled}
        createDrawerWidth="narrow"
      />
    );
  }
}

export default LSGlobalNavigation;
