import React, { useState, useEffect, Fragment } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import DynamicTable from "@atlaskit/dynamic-table";
import PageHeader from "@atlaskit/page-header";
import Layout from "../layout/Layout";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
import { fetcher } from "../modules/api";
import HugeSpinner from "../components/HugeSpinner/HugeSpinner";
import Textfield from "@atlaskit/textfield";
import { SearchWrapper } from "../pages-styles/UsersPage/UsersPage.styles";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";

export default function UsersPage() {
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // TODO: figure out a way to render a loading state
  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(() => {
  //   setLoading(false);
  // });

  const handleSearchEvent = (event) => {
    const {value} = event.target;
    const debounce = 250;
    setTimeout(() => setInputVal(value), debounce);
  }

  const { data, error } = useSWR(
    gql`
      {
        UserList {
          results {
            id
            email
            username
            firstName
            lastName
            parallels {
              results {
                id
              }
            }
          }
        }
      }
    `,
    fetcher
  );

  // TODO: Loading.
  const users = data?.UserList?.results || [];

  // Generating user table header
  const tableHeaderNames = ["Username", "Name", "Email", "Parallels"];

  const mappedTableHead = tableHeaderNames.map((headerNames, i) => ({
    key: headerNames,
    isSortable: true,
    shouldTurncate: false,
    content: headerNames,
  }));

  const tableHeadRow = {
    cells: mappedTableHead,
  };

  // Generating user table rows
  const filterUsers = (users) => {
    const filteredUsers = users.filter((user) => {
      return user.username.toLowerCase().includes(inputVal.toLowerCase());
    });
    return filteredUsers;
  };

  const tableRows = filterUsers(users).map(
    ({ username, lastName, firstName, id, parallels, email }, i) => ({
      cells: [
        {
          key: username,
          content: username,
        },
        {
          key: lastName + firstName,
          content: `${lastName} ${firstName}`,
        },
        {
          key: email,
          content: email,
        },
        {
          key: parallels.results.id,
          content: parallels.results.id,
        },
      ],
      key: id,
      onClick: () => router.push(`/users/${encodeURIComponent(id)}`)
    })
  );

  // TODO: use a banner instead
  // render Error component
  if (error) {
    return <div>Error brah</div>;
  }

  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            <BreadcrumbsItem text="Users" href="/UsersPage" />
          </BreadcrumbsStateless>
        }
      >
        User list
      </PageHeader>
      {!error && !data ? (
        <HugeSpinner />
      ) : (
        <Fragment>
          <SearchWrapper>
            <Textfield
              name="basic"
              isCompact
              placeholder="Search username"
              elemAfterInput={<EditorSearchIcon label="" />}
              onChange={(event) => handleSearchEvent(event)}
            />
          </SearchWrapper>
          <DynamicTable
            head={tableHeadRow}
            rows={tableRows}
            loadingSpinnerSize="large"
            isLoading={loading}
            isFixedSize
            defaultSortKey="Name"
            defaultSortOrder="ASC"
          />
        </Fragment>
      )}
    </Layout>
  );
}