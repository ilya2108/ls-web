import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import pluralize from 'pluralize'
import debounce from 'lodash/debounce'
import { encode } from "js-base64"
import { v4 } from 'uuid'
import Button from "@atlaskit/button";

import { calculateScore, decodeAttemptScript } from '../../utils/score-utils'
import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import { formatSubmissionCreateTime } from '../../utils/date-utils'
import mySubmissions from '../../queries/mySubmissions.gql';
import CorrectionHints from "../assignments/CorrectionHints";
import TimeLeft from "../../components/TimeLeft";


const MAX_CORRECTIONS_SHOWN = 30
const POLL_CORRECTION_TIMEOUT = 5000
const POLL_RELOAD_TIMEOUT = 20000

const queryIdGenerator = () => {
  return v4().substr(0, 3).replace(/\d/g, 'x')
}

export default function Exam() {
  const [solution, updateSolution] = useState('')
  const [loadingCorrection, updateLoadingCorrection] = useState(null)
  const [toggledHint, updateToggledHint] = useState(null)
  const [toggledAttempt, updateToggledAttempt] = useState(null)
  const [extraAttemptsHidden, updateExtraAttemptsHidden] = useState(true)
  const [queryId, updateQueryId] = useState(queryIdGenerator())

  const { data, error } = useSWR(
    gql`query ${queryId} {
      UserMyself {
        id
        activeExam {
          id
          timeLeft
          startTime
          endTime
          assigmnentsOfStudentInExam {
            results {
              id
              name
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
          }
          exam {
            id
          }
        }
      }
    }`,
    fetcher
  )

  const handleReload = () => {
    updateQueryId(queryIdGenerator())
  }

  const exam = data?.UserMyself?.activeExam
  const assignment = exam?.assigmnentsOfStudentInExam?.results[0]
  if (!data) {
    return <Layout>loading</Layout>
  }
  if (!exam || !assignment || !exam.timeLeft) {
    return (
      <Layout>
        no exams
        <br />
        <Button
          onClick={handleReload}
          appearance="primary"
        >reload</Button>

      </Layout>
    )
  }

  const resultScore = calculateScore(assignment)
  const handleSubmit = () => {
    if (!solution) {
      return
    }

    const encodedSolution = encode(solution)
    fetcher(gql`mutation submit {
      SubmissionCreate(data: {
        generatedAssignmentId: "${assignment.id}",
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

  const handleExtraAttemptsShow = () => {
    updateExtraAttemptsHidden(false)
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

  const corrections = assignment?.submissions?.results.map(({ correction, submissionData }) => ({ ...correction, submissionData })).reverse()

  const queryInProgress = corrections.some((correction) => !correction)

  // if (queryInProgress) {
  //   setTimeout(() => {
  //     updateQueryId(queryIdGenerator())
  //   }, POLL_RELOAD_TIMEOUT)
  // }

  return (
    <Layout>
      <h1>Exam: {assignment.name} <TimeLeft timeLeft={exam.timeLeft} endTime={exam.endTime} /></h1>
      <br />
      <div
        className="assignment"
        dangerouslySetInnerHTML={{
          __html: assignment.descriptionHtml
        }}
      />
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
        Score: {resultScore}
        <br />
        Remaining attempts: unlimited
        <br />
      </div>
      <br />
      <Button
        onClick={handleReload}
        appearance="primary"
      >reload</Button>
      {(corrections.length || loadingCorrection) &&
        <div>
          <br />
          <h2>Attempts</h2>
          <div className='attempts-container'>
            <ul>
              {loadingCorrection && <li>{formatSubmissionCreateTime(loadingCorrection.createTime)} — submitted (correcting)</li>}
              {corrections.map((correction, i) => {
                if (i > MAX_CORRECTIONS_SHOWN && extraAttemptsHidden) {
                  return null
                }

                if (!correction || correction?.score == null) {
                  return (
                    <li key={`correction-${v4()}`}>
                      {formatSubmissionCreateTime(correction?.createdAt)} — in progress
                    </li>
                  )
                }

                return (
                  <li key={`correction-${v4()}`}>
                    {formatSubmissionCreateTime(correction?.createdAt)} — <b>{correction?.score} {pluralize('point', correction?.score)}</b>
                    { } — <i className='hints-toggle-handle' onClick={() => handleHintsToggle(i)}>{toggledHint === i ? '(hide hints)' : '(show hints)'}</i>
                    { } | <i className='hints-toggle-handle' onClick={() => handleAttemptToggle(i)}>{toggledAttempt === i ? '(hide attempt)' : '(show attempt)'}</i>
                    {toggledHint === i && <CorrectionHints data={correction?.data} />}
                    <br />
                    {toggledAttempt === i &&
                      <pre>
                        {decodeAttemptScript(correction?.submissionData)}
                      </pre>
                    }
                  </li>
                )
              })}
              {extraAttemptsHidden && corrections.length > MAX_CORRECTIONS_SHOWN && <a href='#' onClick={handleExtraAttemptsShow}>show more</a>}
            </ul>
          </div>
        </div>
      }
    </Layout>
  )
}
