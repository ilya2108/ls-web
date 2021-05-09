import useSWR from "swr";
import { gql } from "graphql-request";

import { fetcher } from "../modules/api";
import User from '../components/users/User'
import React from "react";
import Login from "../components/Login";
import getMyProfile from '../queries/profile.gql';


export default function ProfilePage() {
  const { data, error } = useSWR(
    gql`${getMyProfile.loc.source.body}`,
    fetcher
  );

  if (error) {
    return <Login />
  }

  return (
    <User
      userId={data?.UserMyself?.id}
      userData={data?.UserMyself}
      courseData={data?.CourseList}
      error={error}
      profile
    />
  );
}
