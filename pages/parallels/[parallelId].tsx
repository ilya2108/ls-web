import React, { useState, useRef } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

import { fetcher } from "../../modules/api";

import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Button from "@atlaskit/button";



export default function Parallel() {
  const router = useRouter();
  const { parallelId } = router.query;
  if (!parallelId) {
    return <Loading />
  }

  const [status, setStatus] = useState('')
  const textareaRef = useRef(null)
  const selectRef = useRef(null)

  const { data, error } = useSWR(
    gql`
      query getParallelDetails {
        ParallelDetail(id: ${parallelId}) {
          id
          name
          course {
            id
          }
          students {
            totalCount
            results {
              username
              id
            }
          }
        }
      }
    `,
    fetcher
  )

  const { data: dataExams, error: errorExams } = useSWR(
    gql`
      query exams {
        ExamList {
          results {
            id
            enrollmentCompleted
            hasStarted
            template {
              name
            }
          }
        }
      }
    `,
    fetcher
  )

  const { data: dataUsers, error: errorUsers } = useSWR(
    gql`
      query users {
        UserList {
          results {
            id
            username
          }
        }
      }
    `,
    fetcher
  )

  if ((!data && !error) || (!dataExams && !errorExams) || (!data && !dataUsers)) {
    return <Loading />
  }

  if (error || errorExams || errorUsers) {
    return <Layout><Error errors={{ error, errorExams, errorUsers }} /></Layout>
  }

  const userMap = dataUsers?.UserList?.results?.reduce((map, { username, id }) => {
    map[username] = id
    return map
  }, {})

  const parallelName = data?.ParallelDetail?.name
  const students = data?.ParallelDetail?.students?.results
  const studentIdsMap = students.reduce((map, { username, id }) => {
    map[username] = id
    return map
  }, {})
  const usernames = students.map(({ username }) => username)
  const availableExams = dataExams?.ExamList?.results.map(({ id, template, enrollmentCompleted, hasStarted }) => {
    return {
      id,
      hasStarted,
      enrollmentCompleted,
      name: template.name
    }
  })


  const handleExamStudentAdd = async () => {
    const chosenExamId = selectRef.current.value || availableExams[0].id
    const chosenExamDetail = availableExams.find((exam) => {
      return `${exam.id}` === chosenExamId
    })
    if (chosenExamDetail?.hasStarted) {
      setStatus('Cannot add students, exam has started.')
      return
    }
    if (chosenExamDetail?.enrollmentCompleted) {
      setStatus('Cannot add studens, exam is locked, you can start it.')
      return
    }

    const students = textareaRef.current.value.split(" ")
    const effectiveIds = students.map((username) => {
      return studentIdsMap[username] || userMap[username]
    }).filter((x) => x)
    const jobs = effectiveIds.map((id) => {
      return fetcher(gql`mutation addStudentToExam{
        StudentWritesExamCreate(data: {examId: ${chosenExamId}, studentId: ${id}}){
          object{
            id
            student{
              username
            }
          }
        }
      }`)
    })

    Promise.all(jobs)
      .then(() => {
        setStatus('All students were added, you can Complete enrollment.')
        window.location.pathname = `/exams/edit/${chosenExamId}`
      })
      .catch((e) => {
        setStatus('There were some errors')
        console.error(e)
      })
    
    setStatus('Adding students, please wait')
  }
  
  const handleExamComplete = () => {
    const chosenExamId = selectRef.current.value || availableExams[0].id
    const chosenExamDetail = availableExams.find((exam) => {
      return `${exam.id}` === chosenExamId
    })
    if (chosenExamDetail?.hasStarted ) {
      setStatus('Cannot add studens, exam has already started.')
      return
    }
    if (chosenExamDetail?.enrollmentCompleted) {
      setStatus('Cannot add studens, exam is already locked (enrollment is completed).')
      return
    }

    fetcher(gql`mutation completeEnrollment{
      ExamCompleteEnrollment(data: {id: ${chosenExamId}}){
        job{
          id
        }
      }
    }`)
    .then(() => {
      setStatus('Exam enrollment is done, wait a while till Learnshell generates it and you can Start!')
    })
    .catch(() => {
      setStatus('We had problems with completing enrollment')
    })

    setStatus('Locking exam, please wait')
  }
  
  const handleExamStart = () => {
    const chosenExamId = selectRef.current.value || availableExams[0].id
    const chosenExamDetail = availableExams.find((exam) => {
      return `${exam.id}` === chosenExamId
    })
    if (chosenExamDetail?.hasStarted) {
      setStatus('Exam already started.')
      return
    }
    if (chosenExamDetail && !chosenExamDetail.enrollmentCompleted) {
      setStatus('You have to Complete enrollment first. Try reloading page if you did it already.')
      return
    }

    return fetcher(gql`mutation startExam{
      ExamStart(data: {id: ${chosenExamId}}){
        object{
          id
          startTime
        }
      }
    }`)
    .then(() => {
      setStatus('Exam started!')
    })
    .catch(() => {
      setStatus('We had problems starting exam')
    })
  }


  return (
    <Layout>
      <h1>Parallel: {parallelName || parallelId} </h1>
      <br />
      <h3>Usernames:</h3>
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          className="textarea"
          rows={10}
          spellCheck="false"
          placeholder="student usernames"
          defaultValue={usernames.join(" ")}
          // onChange={handleUsernamesChange}
        />
      </div>
      <br />
      <br />
      {availableExams && availableExams.length &&
        <div className='exam-create-container'>
          <h1>Start an exam</h1>
          <br />
          <br />
          <br />
          <select ref={selectRef} defaultValue={availableExams[0].id}>
            {availableExams
              .sort((e1, e2) => {
                if (e1.name > e2.name) {
                  return -1
                }

                if (e2.name > e1.name) {
                  return 1
                }

                return 0
              })
              .map((exam) => {
                return <option value={exam.id}>{exam.name}</option>
              })
            }
          </select>
          <br />
          <Button appearance="primary" onClick={handleExamStudentAdd}>Add selected students to this Exam</Button>
          {/* <button className="butt" onClick={handleExamComplete}>Complete enrollment</button>
          <button className="butt" onClick={handleExamStart}>Start exam</button> */}
          <br />
          <br />
          <br />
          <br />
          <div className="status">
            {status}
          </div>
          <br />
          <br />
          <br />
          <a href="/exams/admin/list">See all exams</a>
          <br />
        </div>
      }
    </Layout>
  )
}
