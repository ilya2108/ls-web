import { useRouter } from "next/router";
import useSWR from "swr";
import { unix } from 'dayjs'
import { useDispatch } from "react-redux";

import { gql } from "graphql-request";
import { fetcher } from "../../../modules/api";
import Layout from "../../../layout/Layout";
import React, { useState } from "react";
import { queryIdGenerator } from "../../../utils/graphql-utils";
import Button from "@atlaskit/button";
import { assignmentCreatedFlag } from "../../../modules/core/redux/flag/flag.actions";
import TimeLeft from "../../../components/TimeLeft";
import dayjs from 'dayjs'


export default function EditExam() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, updateLoading] = useState(false)
  const [queryId, updateQueryId] = useState(queryIdGenerator())
  const { examId } = router.query;

  // if (!examId) {
  //   return (
  //     <Layout>loading</Layout>
  //   )
  // }

  // const { data, error } = useSWR(
  //   gql`query ExamDetail {
  //     ExamTemplateDetail(id: ${examId}) {
  //       id
  //       name
  //       timelimit
  //     }
  //   }`,
  //   fetcher
  // )

  const { data, error } = useSWR(
    gql`query ExamDetail {
      ExamDetail(id: ${examId || 0}) {
        id
        template {
          id
          name
        }
        timeLimit
        enrollmentCompleted
        # studentCount
        startTime
        # endTime
        hasStarted
        # timeLeft
      }
    }`,
    fetcher
  )

  const { data: examAssignmentData, error: examAssignmentError } = useSWR(
    gql`query ExamAssignments {
      AssignmentExamTemplateList{
        results {
          assignment {
            id
            name
          }
          examTemplate {
            id
          }
        }
      }
    }`,
    fetcher
  )

  if (!data || !examAssignmentData) {
    return (
      <Layout>
        loading
      </Layout>
    )
  }

  const exam = data?.ExamDetail
  const examAssignmentMap = examAssignmentData?.AssignmentExamTemplateList?.results
  if (!exam || !examAssignmentMap || error || examAssignmentError) {
    return (
      <Layout>
        error loading exam
      </Layout>
    )
  }

  const examAssignments = examAssignmentMap.reduce((assignments, map) => {
    const { assignment, examTemplate } = map
    if (examTemplate.id === exam.template.id) {
      assignments.push(assignment)
    }

    return assignments
  }, [])


  const checkJobStatus = (jobId: string) => {
    return new Promise((resolve, reject) => {
      fetcher(
        gql`query ${queryId} {
          JobDetail(id: ${jobId}) {
            result
            finished
        }}`)
        .then((response) => {
          if (response.JobDetail?.finished && response.JobDetail?.result) {
            console.log("generated", response.JobDetail?.result)
            resolve()
            return
          }

          if (response.JobDetail?.finished && response.JobDetail?.result === null) {
            dispatch(assignmentCreatedFlag('error', `Failed to generate assignment for students`))
            reject()

            return
          }

          setTimeout(() => {
            resolve(checkJobStatus(jobId))
          }, 2000)
        })
    })
  }

  const handleExamComplete = () => {
    if (exam.hasStarted ) {
      dispatch(assignmentCreatedFlag('error', `Exam has already started`))
      return
    }
    if (exam?.enrollmentCompleted) {
      dispatch(assignmentCreatedFlag('error', `Exam enrollment is already completed`))
      return
    }

    fetcher(gql`mutation completeEnrollment{
      ExamCompleteEnrollment(data: {id: ${examId}}){
        job {
          id
        }
      }
    }`)
    .then((response) => {
      const jobId = response.ExamCompleteEnrollment?.job?.id
      if (!jobId) {
        console.error('1', response)
        dispatch(assignmentCreatedFlag('error', `Exam enrollment failed (no job id)`))
        return
      }

      updateLoading(true)
      dispatch(assignmentCreatedFlag('success', `Generating assignment for students, please wait`))

      return checkJobStatus(jobId)
    })
    .then(() => {
      updateLoading(false)

      window.location.reload()
      dispatch(assignmentCreatedFlag('success', `All assignments were generated, you can start now`))
    })
    .catch((e) => {
      console.error('2', e)
      dispatch(assignmentCreatedFlag('error', `Exam enrollment failed`))
    })
  }

  const handleExamStart = () => {
    if (exam.hasStarted) {
      dispatch(assignmentCreatedFlag('error', `Exam has already started`))
      return
    }
    if (!exam.enrollmentCompleted) {
      dispatch(assignmentCreatedFlag('error', `Exam enrollment is not completed yet, cannot start`))
      return
    }

    return fetcher(gql`mutation startExam{
      ExamStart(data: {id: ${examId}}){
        object {
          id
          startTime
        }
      }
    }`)
    .then(() => {
      dispatch(assignmentCreatedFlag('success', `Exam start successful`))
      window.location.reload()
    })
    .catch((e) => {
      console.error(e)
      dispatch(assignmentCreatedFlag('error', `Exam start failed`))
    })
  }


  return (
    <Layout>
      <h1>{exam.template.name}</h1>
      <br />
      <h3>Details</h3>
      <p>
        Limit: {unix(exam.timeLimit).format("mm:ss")}
        <br />
        {/* Student count: {exam.studentCount} */}
        {/* <br /> */}
        Enrollment completed: {String(exam.enrollmentCompleted)}
        <br />
        Started: {String(exam.hasStarted)}
        <br />
      </p>
      <h3>Assignments</h3>
      <br />
      {examAssignments.map((assignment) => {
        return <a href={`/assignments/edit/${assignment.id}`}>{assignment.name}</a>
      })}
      <br />
      <br />
      {exam.enrollmentCompleted && exam.hasStarted ?
      (
        <div>
          <h3>Exam has started</h3>
          <br />
          Start time (UTC): {dayjs(exam.startTime.replace(/\+00\:00/, '')).format("HH:mm:ss")}
          <br />
          {/* End time: {exam.endTime} */}
          {/* <br /> */}
          {exam.timeLeft ? (<>Time left: <TimeLeft timeLeft={exam.timeLeft} endTime={exam.endTime} /> </>) : ''}
        </div>
      ) : (
        <>
          <h3>Actions</h3>
          <br />
          {loading && 'Generating assignments is in progress, please wait'}
          <br />
          <Button
            appearance={exam.enrollmentCompleted ? 'subtle' : 'primary'}
            disabled={exam.enrollmentCompleted}
            onClick={handleExamComplete}
          >
            Complete enrollment
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            appearance={exam.enrollmentCompleted && !exam.hasStarted ? 'primary' : 'subtle'}
            disabled={!exam.enrollmentCompleted || exam.hasStarted}
            onClick={handleExamStart}
          >
            Start exam
          </Button>
        </>
      )}


    </Layout>
  )
}
