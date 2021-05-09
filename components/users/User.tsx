import { gql } from "graphql-request";
import React, { Fragment, useState } from "react";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";

import Lozenge from "@atlaskit/lozenge";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { ErrorMessage, Field, FormFooter } from "@atlaskit/form";
import PageHeader from "@atlaskit/page-header";
import TextField from "@atlaskit/textfield";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";

import Layout from "../../layout/Layout";
import Error from "../Error";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
import {
  ButtonCell,
  Header,
  HRow,
  HTag,
  LeftCell,
  RightCell,
  Row,
  Tab,
  TabContent,
  TabGroup,
  Table,
} from "../../pages-styles/UserPage/UserPage.styles";
import UserCoursesInfoSection from "./UserCoursesInfoSection";
import UserPointsInfoSection from "./UserPointsInfoSection";
import { fetcher } from "../../modules/api";
import { formatDate } from "../../utils/date-utils";
import {
  passwordChangeErrorFlag,
  passwordChangeSuccessFlag,
} from "../../modules/core/redux/flag/flag.actions";
import UserSubmissionsSection from "./UserSubmissionsSection";
import StudentsDashboard from "../Dashboards/StudentsDashboard";
import TeachersDashboard from "../Dashboards/TeachersDashboard";

type Props = {
  userId: string;
  error: Error;
  userData: any;
  profile: boolean;
  courseData: any;
};

export default function UserPage(props: Props) {
  const { userId, error, userData, profile, courseData } = props;

  const {
    firstName,
    lastName,
    email,
    assignments,
    dateJoined,
    isActive,
    isStaff,
    isSuperuser,
    username,
    courses,
    parallels,
    coursesAsStudent,
    coursesAsTeacher,
    id,
  } = userData || [];

  const dispatch = useDispatch();
  const dispatchPasswordChangeSuccess = () =>
    dispatch(passwordChangeSuccessFlag());
  const dispatchPasswordChangeError = (e) =>
    dispatch(passwordChangeErrorFlag(e));

  // handle password-edit event
  const [editPasswordState, setEditPasswordState] = useState(false);

  const handleSubmit = (data: { password: string; repeatPassword: string }) => {
    const err = {
      repeatPassword:
        data.password !== data.repeatPassword
          ? "Entered passwords do not match."
          : undefined,
    };

    if (!err.repeatPassword) {
      fetcher(gql`mutation {
        UserSetPassword(data: {id: "${userId}", password: "${data.password}" }) {
          object {
            id
            username
            firstName
            lastName
          }
        }
      
      }`).catch((e) => dispatchPasswordChangeError(e));

      setEditPasswordState(!editPasswordState);
      dispatchPasswordChangeSuccess();
    }

    return err;
  };

  // render spinner
  const renderSpinner = !error && !userData;

  if (error) {
    return <Error />;
  }

  const homeTabName = "Home";
  const assignmentTabName = "Assignments";
  const studentsDashboardTabName = "Student's Dashboard";
  const teachersDashboardTabName = "Teacher's Dashboard";

  const getTabs = () => {
    const home = true;
    const assignment = !profile;
    const studentsDashboard = coursesAsStudent.totalCount !== 0;
    const teachersDashboard = coursesAsTeacher.totalCount !== 0 || isSuperuser;

    return [
      home ? homeTabName : null,
      assignment ? assignmentTabName : null,
      studentsDashboard ? studentsDashboardTabName : null,
      teachersDashboard ? teachersDashboardTabName : null,
    ].filter((e) => e !== null);
  };

  const tabNames =
    coursesAsTeacher && coursesAsStudent ? getTabs() : [homeTabName];
  const [active, setActive] = useState(tabNames[0]);
  const [hovered, setHovered] = useState(null);
  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            {!profile && <BreadcrumbsItem text="Users" href="/users" />}
            {!profile && !renderSpinner && (
              <BreadcrumbsItem href={`/users/${userId}`} text={username} />
            )}
            {profile && <BreadcrumbsItem href="/profile" text={username} />}
          </BreadcrumbsStateless>
        }
      >
        {renderSpinner ? null : `${firstName} ${lastName}`}
      </PageHeader>

      {renderSpinner ? (
        <HugeSpinner />
      ) : error ? null : (
        <>
          <TabGroup>
            {tabNames.map((tabName) => (
              <Tab
                key={tabName}
                active={active === tabName}
                hovered={hovered === tabName}
                onClick={() => setActive(tabName)}
                onMouseEnter={() => setHovered(tabName)}
                onMouseLeave={() => setHovered(null)}
              >
                {tabName}
              </Tab>
            ))}
          </TabGroup>
          <TabContent>
            {active == homeTabName && (
              <Table>
                <Header>
                  <HRow>
                    {isActive ? (
                      <HTag>
                        <Lozenge appearance="success" isBold>
                          Active
                        </Lozenge>
                      </HTag>
                    ) : (
                      <HTag>
                        <Lozenge isBold>Inactive</Lozenge>
                      </HTag>
                    )}
                    {isSuperuser ? (
                      <HTag>
                        <Lozenge appearance="new" isBold>
                          Admin
                        </Lozenge>
                      </HTag>
                    ) : null}
                    {isStaff ? (
                      <HTag>
                        <Lozenge appearance="inprogress" isBold>
                          Staff
                        </Lozenge>
                      </HTag>
                    ) : null}
                  </HRow>
                  <HTag>
                    <strong>{assignments.totalCount}</strong>{" "}
                    {pluralize("assignment", assignments.totalCount)}
                  </HTag>
                  <HTag>
                    <strong>{courses.totalCount}</strong>{" "}
                    {pluralize("course", courses.totalCount)}
                  </HTag>
                  <HTag>
                    <strong>{parallels.totalCount}</strong>{" "}
                    {pluralize("parallel", parallels.totalCount)}
                  </HTag>
                </Header>

                <Row>
                  <UserCoursesInfoSection userData={userData} />
                </Row>

                <Row>
                  <UserPointsInfoSection userData={userData} />
                </Row>

                <Row>
                  <LeftCell>Username</LeftCell>
                  <RightCell>
                    <strong>{username}</strong>
                  </RightCell>
                </Row>
                <Row>
                  <LeftCell>Date joined</LeftCell>
                  <RightCell>
                    <strong>{formatDate(dateJoined)}</strong>
                  </RightCell>
                </Row>
                <Row>
                  <LeftCell>Email</LeftCell>
                  <RightCell>
                    <strong>{email}</strong>
                  </RightCell>
                </Row>
                {!profile && (
                  <Button
                    appearance="primary"
                    spacing="compact"
                    href={`${process.env.BACKEND_ROOT_URI}/auth/impersonate?as=${username}`}
                  >
                    Impersonate {username}
                  </Button>
                )}
                {profile && (
                  <Row>
                    <LeftCell>Password</LeftCell>
                    <RightCell>
                      {editPasswordState ? (
                        <Form onSubmit={handleSubmit}>
                          {({ formProps, submitting }) => (
                            <form {...formProps}>
                              <Field
                                name="password"
                                defaultValue=""
                                label="New Password"
                                isRequired
                              >
                                {({ fieldProps }) => (
                                  <TextField type="password" {...fieldProps} />
                                )}
                              </Field>
                              <Field
                                name="repeatPassword"
                                defaultValue=""
                                label="Repeat Password"
                                isRequired
                              >
                                {({ fieldProps, error }) => (
                                  <Fragment>
                                    <TextField
                                      type="password"
                                      {...fieldProps}
                                    />
                                    {error && (
                                      <ErrorMessage>{error}</ErrorMessage>
                                    )}
                                  </Fragment>
                                )}
                              </Field>
                              <FormFooter>
                                <ButtonGroup>
                                  <Button
                                    appearance="subtle"
                                    onClick={() =>
                                      setEditPasswordState(!editPasswordState)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    appearance="primary"
                                    type="submit"
                                    isLoading={submitting}
                                  >
                                    Save
                                  </Button>
                                </ButtonGroup>
                              </FormFooter>
                            </form>
                          )}
                        </Form>
                      ) : (
                        <strong>●●●●●●</strong>
                      )}
                    </RightCell>
                    <ButtonCell>
                      {editPasswordState ? null : (
                        <Button
                          appearance="primary"
                          spacing="compact"
                          onClick={() =>
                            setEditPasswordState(!editPasswordState)
                          }
                        >
                          Change password
                        </Button>
                      )}
                    </ButtonCell>
                  </Row>
                )}
              </Table>
            )}
            {active == assignmentTabName && !profile && (
              <UserSubmissionsSection userData={userData} />
            )}
            {active == studentsDashboardTabName && (
              <StudentsDashboard
                courses={coursesAsStudent}
                userData={userData}
                userId={userId}
                profile={profile}
              />
            )}
            {active == teachersDashboardTabName &&
              profile &&
              (isStaff || isSuperuser) && (
                <TeachersDashboard
                  courses={isSuperuser ? courseData : coursesAsTeacher}
                />
              )}
          </TabContent>
        </>
      )}
    </Layout>
  );
}
