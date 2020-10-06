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
import ShortcutIcon from "@atlaskit/icon/glyph/shortcut";
import Button from '@atlaskit/button';

export default function UsersPage() {
  const [inputVal, setInputVal] = useState("");
  // TODO: figure out a way to render a loading state
  const [loading, setLoading] = useState(false);

  const handleSearchEvent = (event) => {
    const { value } = event.target;
    const debounce = 250;
    setTimeout(() => setInputVal(value), debounce);
  };

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
        {
          content: (
            <Button
              iconAfter={<ShortcutIcon label="" />}
              appearance="subtle-link"
              href={`/users/${encodeURIComponent(id)}`}
            />
          ),
        },
      ],
      key: id,
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
            isLoading={false}
            isFixedSize
            defaultSortKey="Name"
            defaultSortOrder="ASC"
          />
        </Fragment>
      )}
    </Layout>
  );
}