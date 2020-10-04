import React, { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import DynamicTable from "@atlaskit/dynamic-table";
import PageHeader from "@atlaskit/page-header";
import Layout from "../layout/Layout";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
import { fetcher } from "../modules/api";
import HugeSpinner from "../components/HugeSpinner/HugeSpinner";
import {
  QuickSearch,
  ResultItemGroup,
  PersonResult,
} from "@atlaskit/quick-search";

export default function UsersPage() {
  const router = useRouter();
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
          }
        }
      }
    `,
    fetcher
  );

  // TODO: Loading.
  const users = data?.UserList?.results || [];

  // Generating user table header
  // const tableHeaderNames = ["Name", "Username", "Email"];

  // const mappedTableHead = tableHeaderNames.map((headerNames, i) => ({
  //   key: headerNames,
  //   isSortable: true,
  //   shouldTurncate: false,
  //   content: headerNames,
  // }));

  // const tableHeadRow = {
  //   cells: mappedTableHead,
  // };

  // Generating user table rows
  // const tableRows = users.map(
  //   ({ lastName, firstName, id, username, email }, i) => ({
  //     cells: [
  //       {
  //         // Name
  //         key: lastName + firstName,
  //         content: (
  //           <Link href={`/users/${encodeURIComponent(id)}`}>
  //             <a>
  //               {lastName} {firstName}
  //             </a>
  //           </Link>
  //         ),
  //       },
  //       {
  //         // Username
  //         key: username,
  //         content: (
  //           <Link href={`/users/${encodeURIComponent(id)}`}>
  //             <a>{username}</a>
  //           </Link>
  //         ),
  //       },
  //       {
  //         // Email
  //         key: email,
  //         content: email,
  //       },
  //     ],
  //     key: username,
  //   })
  // );

  // search
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: test loading state on a bigger data set
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    setLoading(false);
  });

  const filterUsers = () => {
    const filteredUsers = users.filter((user) => {
      return user.username.toLowerCase().includes(inputVal.toLowerCase());
    });
    return filteredUsers;
  };

  const userList = (users) =>
    users.map(({ lastName, firstName, id, username, email }, i) => (
      <PersonResult
        resultId={id}
        key={id}
        name={firstName + " " + lastName}
        mentionName={email}
        mentionPrefix=""
        presenceMessage={username}
        onClick={() => router.push(`/users/${encodeURIComponent(id)}`)}
      />
    ));
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
        <section>
          {/* <DynamicTable
            caption={null}
            head={tableHeadRow}
            rows={tableRows}
            loadingSpinnerSize="large"
            isLoading={false}
            isFixedSize
            defaultSortKey="Name"
            defaultSortOrder="ASC"
          /> */}
          <QuickSearch
            isLoading={loading}
            onSearchInput={({ target }: React.FormEvent<HTMLInputElement>) => {
              // @ts-ignore
              setInputVal(target.value);
              setLoading(true);
            }}
            value={inputVal}
          >
            <ResultItemGroup title="">
              {userList(filterUsers())}
            </ResultItemGroup>
          </QuickSearch>
        </section>
      )}
    </Layout>
  );
}