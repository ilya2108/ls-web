import { useRouter } from "next/router";
import useSWR from "swr";

import { gql } from "graphql-request";
import { fetcher } from "../../../modules/api";
import Layout from "../../../layout/Layout";
import React, { useState } from "react";
import { queryIdGenerator } from "../../../utils/graphql-utils";


export default function AssignmentTestJob() {
  const router = useRouter();
  const [queryId, updateQueryId] = useState(queryIdGenerator())
  const { jobId } = router.query;

  const { data, error } = useSWR(
    gql`query ${queryId} {
      JobDetail(id: ${jobId}) {
        result
        finished
    }}`,
    fetcher
  )

  const job = data?.JobDetail
  if (!job || error || !job.finished) {
    setTimeout(() => {
      updateQueryId(queryIdGenerator())
    }, 1000)

    return (
      <Layout>
        loading
      </Layout>
    )
  }

  const result = JSON.parse(job.result)
  if (!result) {
    return (
      <Layout>no result</Layout>
    )
  }

  window.location.pathname = `/assignments/${result.pk}`
}
