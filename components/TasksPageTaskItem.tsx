import React from "react";
import { gql } from "graphql-request";
import { useDispatch } from "react-redux";

import { fetcher } from "../modules/api";
import { assignmentCreatedFlag } from "../modules/core/redux/flag/flag.actions";
type Props = {
  task: {
    id: number,
    name: string,
    description: string,
    published: boolean,
    exam: {
      id: string,
    }
  }
  admin?: boolean
}

export default function TasksPageTaskItem(props: Props) {
  const dispatch = useDispatch()
  const { admin, task } = props
  if (task.exam?.id) {
    return null
  }

  const handlePublish = () => {
    console.log("Publishing assignment", task.id)
    fetcher(gql`mutation publish {
      AssignmentPublish(data: {id: ${task.id} }) {
        job {
          id
        }
      }
    }`)
    .then((response) => {
      const jobId = response.AssignmentPublish?.job?.id
      if (!jobId) {
        dispatch(assignmentCreatedFlag('error', 'Failed to publish assignment'))
        return
      }

      console.log("Published assignment", {jobId})
      dispatch(assignmentCreatedFlag('success', 'Published assignment', 'Please wait a few minutes...'))
    })
    .catch((error) => {
      dispatch(assignmentCreatedFlag('error', 'Failed to create assignment'))
      console.error(error)
    })
  }

  return (
    <div className='exam'>
      <a className='exam-link' href={admin ? `/assignments/edit/${task.id}/` : `/assignments/${task.id}`}>
        {task.name} {}
        {(task.exam?.id ? `(exam)` : '(homework)')} {(task.published && admin) ? '[PUBLISHED]' : ''}
      </a>
      {/* {admin && <span> — <i className="hints-toggle-handle" onClick={handlePublish}>publish</i></span>} */}
      {admin && <a className="exam-edit hints-toggle-handle" href={`/assignments/edit/${task.id}/`}>Edit</a>}
    </div>
  )
}
