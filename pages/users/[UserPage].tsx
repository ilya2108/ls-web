import useSWR from "swr";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React from "react";
import User from '../../components/users/User'
import { fetcher } from "../../modules/api";

export default function UserPage() {
  const router = useRouter();
  const { UserPage: rawUserId } = router.query;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId

  const { data, error } = useSWR(
    gql`
      {
        UserDetail(id: "${userId}") {
          firstName
          lastName
          email
          assignments {
            totalCount
          }
          dateJoined
          ipAddress
          isActive
          isStaff
          isSuperuser
          username
          courses {
            totalCount
            results (ordering: "id"){
              id
              kosTag
              kosSemester
            }
          }
          parallels {
            totalCount
          }

          parallelsAsTeacher {
            totalCount
            results {
              name
              id
              course {
                kosTag
              }
            }
          }

          parallelsAsStudent {
            totalCount
            results {
              name
              id
              course {
                kosTag
              }
            }
          }

          assignments {
            totalCount
            results {
              assignment {
                id
                name
              }
              score
              submissions {
                results {
                  correction {
                    id
                    score
                    submission {
                      createdAt
                      id
                      submissionData
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    fetcher
  );

  return (
    <User
      userId={userId}
      userData={data?.UserDetail}
      error={error}
      profile={false}
    />
  )
}
