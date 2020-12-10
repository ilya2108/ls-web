import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useState } from "react";
import debounce from 'lodash/debounce'
import { encode } from "js-base64"

import { calculateScore } from '../../utils/score-utils'
import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import Button from "@atlaskit/button";
import SubmissionAttempts from "../../components/SubmissionAttempts";
import { queryIdGenerator, sortCorrections } from "../../utils/graphql-utils";
import AssignmentDescription from "../../components/AssignmentDescription";

const POLL_CORRECTION_TIMEOUT = 5000

const isTeacher = (generatedFor: string) => {
  return ['zitnyjak', 'muzikar', 'cermada1', 'cernyvi2', 'soch', 'jancijak', 'barinkl', 'kaspaji3', 'trdlicka', 'horskyma7'].includes(generatedFor)
}

export default function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [solution, updateSolution] = useState('')
  const [loadingCorrection, updateLoadingCorrection] = useState(null)
  const [toggledHint, updateToggledHint] = useState(null)
  const [toggledAttempt, updateToggledAttempt] = useState(null)
  const [extraAttemptsHidden, updateExtraAttemptsHidden] = useState(true)
  const [queryId, updateQueryId] = useState(queryIdGenerator())

  // const { data, error } = useSWR(
  //   gql`query ${queryId} {
  //     UserMyself {
  //       assignments {
  //         totalCount
  //         results {
  //           id
  //           name
  //           descriptionHtml
  //           submissions {
  //             results {
  //               submissionData
  //               correction {
  //                 id
  //                 score
  //                 createdAt
  //                 data
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }`,
  //   fetcher
  // )

  const { data, error } = useSWR(
    gql`query ${queryId} {
      GeneratedAssignmentDetail(id: ${assignmentId}) {
        id
        name
        student {
          username
        }
        assignment {
          id
        }
        descriptionHtml
        submissions {
          results {
            submissionData
            correction {
              id
              score
              createdAt
              data
            }
          }
        }
      }
    }`,
    fetcher
  )

  const handleReload = () => {
    updateToggledAttempt(null)
    updateToggledHint(null)
    updateQueryId(queryIdGenerator())
  }

  const assignment = data?.GeneratedAssignmentDetail
  // const assignment = data?.UserMyself?.assignments?.results?.find((a) => {
  //   return `${a.id}` === assignmentId
  // })

  if (!assignment) {
    return <Loading />
  }

  const resultScore = calculateScore(assignment)
  const handleSubmit = () => {
    if (!solution) {
      return
    }

    const encodedSolution = encode(solution)
    fetcher(gql`mutation submit {
      SubmissionCreate(data: {
        generatedAssignmentId: "${assignmentId}",
        submissionData: "{ \\"script\\": \\"${encodedSolution}\\" }",
      }) {
        job {
          id
          createTime
        }
      }
    }`)
    .then((response) => {
      const submissionJob = response.SubmissionCreate.job
      updateLoadingCorrection(submissionJob)

      setTimeout(() => {
        updateToggledAttempt(null)
        updateToggledHint(null)
        updateQueryId(queryIdGenerator())
        updateLoadingCorrection(null)
      }, POLL_CORRECTION_TIMEOUT)
    })
    .catch((e) => console.error(e));
  }

  const updateSolutionDebounced = debounce(updateSolution, 500)
  const handleSolutionChange = (event) => {
    updateSolutionDebounced(event.target.value)
  }


  const handleHintsToggle = (hintId: number) => {
    if (toggledHint === hintId) {
      updateToggledHint(null)
      return
    }

    updateToggledHint(hintId)
  }

  const handleAttemptToggle = (hintId: number) => {
    if (toggledAttempt === hintId) {
      updateToggledAttempt(null)
      return
    }

    updateToggledAttempt(hintId)
  }

  const corrections = assignment?.submissions?.results
    .map(({ correction, submissionData }) => ({ ...correction, submissionData }))

  const sortedCorrections  = corrections.sort(sortCorrections)

  const maxPoints = null
  // const maxPoints = corrections.reduce((sum, correction) => {
  //   return sum + (correction?.score ?? 0)
  // }, 0)

  // const queryInProgress = corrections.some((correction) => !correction)

  // if (queryInProgress) {
  //   setTimeout(() => {
  //     updateQueryId(queryIdGenerator())
  //   }, POLL_RELOAD_TIMEOUT)
  // }

  return (
    <Layout>
      <h1>Assignment: {assignment.name}</h1>
      <br />
      <AssignmentDescription assignmentHtml={assignment.descriptionHtml} />
      <h2>Solution</h2>
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          rows={10}
          spellCheck="false"
          defaultValue={solution}
          onBlur={handleSolutionChange}
          onChange={handleSolutionChange}
        />
        <button onClick={handleSubmit} disabled={!solution || loadingCorrection}>Submit</button>
      </div>
      <br />
      <br />
      <h2>Results</h2>
      <div>
        Current score: {resultScore}
        <br />
        {Boolean(maxPoints) &&
          <>
            <span>Max points: {maxPoints}</span>
            <br />
          </>
        }
        Remaining attempts: unlimited
        <br />
      </div>
      <br />
      <Button
        onClick={handleReload}
        appearance="primary"
      >reload</Button>
      &nbsp;&nbsp;&nbsp;
      {isTeacher(assignment.student.username) && assignment.assignment.id&&
        <Button
          href={`/assignments/edit/${assignment.assignment.id}`}
          appearance="warning"
        >go back</Button>
      }
      {(corrections.length || loadingCorrection) &&
        <SubmissionAttempts
          toggledHint={toggledHint}
          toggledAttempt={toggledAttempt}
          corrections={sortedCorrections}
          loadingCorrection={loadingCorrection}
          onHintToggle={handleHintsToggle}
          onAttemptToggle={handleAttemptToggle}
        />
      }
    </Layout>
  )
}
