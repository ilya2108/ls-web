// documentation
// Drawer: https://atlaskit.atlassian.com/packages/design-system/drawer
// Quick search: https://atlaskit.atlassian.com/packages/search/quick-search

// TODO: Make search logic
import React from "react";
import {
  ObjectResult,
  ResultItemGroup,
  QuickSearch, ContainerResult,
} from "@atlaskit/quick-search";

import Avatar from "@atlaskit/avatar";
import ContainerNavigation from "../ContainerNavigation/ContainerNavigation";
import {searchFetcher} from "../../modules/api";
import {gql} from "graphql-request";
import {router} from "next/client";

const defaultProps = {
  resultId: "result_id",
};

const dummyAvatarComponent = (
  <Avatar
    src="https://hello.atlassian.net/secure/projectavatar?pid=30630"
    appearance="square"
  />
);

const avatarUrl = "https://hello.atlassian.net/secure/projectavatar?pid=30630";

interface UserDocument {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  ipAddress: string;
  isStaff: boolean;
  id: number;
}

class SearchDrawer extends React.Component<
  {},
  { isLoading: boolean; query: string, searchResult: []}
> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      query: "",
      searchResult: [],
    };
  }

  search(value?: string) {
    this.setState({
      query: value,
      isLoading: true
    });
    const sendQuery = async () => {
      const data = await searchFetcher(gql`query searchByGivenQuery($query: String!) {
        userIndex(query: $query) {
          username
          firstName
          lastName
          email
          ipAddress
          isStaff
          id
        }
      }`, {'query' : value});
      console.log(data);
      this.setState({searchResult: data.userIndex, isLoading: false});
    };
    sendQuery();
  }

  render() {
    const objectResults = this.state.searchResult.map((el:UserDocument) => {
      return <ObjectResult onClick={() => router.push(`/users/${el.id}`)} resultId={el.id} name={el.username} avatarUrl={avatarUrl} containerName="users" caption="Caption test..."/>
    });

    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={(event ) => {
          // @ts-ignore
          this.search(event.target.value);
        }}
        value={this.state.query}
      >
        <ResultItemGroup title="xSearch result">
          {objectResults}
        </ResultItemGroup>
      </QuickSearch>
    );
  }
}
export default SearchDrawer;
