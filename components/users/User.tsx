import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React, { useState, Fragment } from "react";
import Lozenge from "@atlaskit/lozenge";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { Field, FormFooter, ErrorMessage } from "@atlaskit/form";
import PageHeader from "@atlaskit/page-header";
import TextField from "@atlaskit/textfield";
import Layout from "../../layout/Layout";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
import {
  Table,
  Row,
  LeftCell,
  RightCell,
  Header,
  HRow,
  HTag,
  ButtonCell,
} from "../../pages-styles/UserPage/UserPage.styles";
import { fetcher } from "../../modules/api";
import { formatDate } from "../../utils/date-utils";
import { useDispatch } from "react-redux";
import {
  addFlag,
  dismissFlag,
} from "../../modules/core/redux/flag/flag.actions";
import {
  PasswordChangeSuccessFlag,
  PasswordChangeErrorFlag,
  ConnectionIssuesFlag,
} from "../LSFlags/LSFlags";

type Props = {
  userId: string;
  error: Error;
  userData: any;
};

export default function UserPage(props: Props) {
  const { userId, error, userData } = props;
  const router = useRouter();

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
    jobs,
    courses,
    parallels,
    id,
  } = userData || [];

  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());
  const dispatchPasswordChangeSuccess = () =>
    dispatch(addFlag(PasswordChangeSuccessFlag(dispatchDismissFlag)));
  const dispatchPasswordChangeError = (e) =>
    dispatch(addFlag(PasswordChangeErrorFlag(e, dispatchDismissFlag)));

  const forceRefresh = () => {
    router.push(`/users/${encodeURIComponent(id)}`);
    // dispatch dismiss flag
  };
  const dispatchConnectionIssues = () =>
    dispatch(addFlag(ConnectionIssuesFlag(forceRefresh)));

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

  // TODO: use errorboundary
  if (error) {
    // experimental connection issues flag calling
    // dispatchConnectionIssues();
    return <div>Error brah</div>
  }

  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            <BreadcrumbsItem text="Users" href="/UsersPage" />
            {renderSpinner ? null : (
              <BreadcrumbsItem href={`/users/${userId}`} text={username} />
            )}
          </BreadcrumbsStateless>
        }
      >
        {renderSpinner ? null : `${firstName} ${lastName}`}
      </PageHeader>
      {renderSpinner ? (
        <HugeSpinner />
      ) : error ? null : (
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
              <strong>{assignments.totalCount}</strong> assignments
            </HTag>
            <HTag>
              <strong>{jobs.totalCount}</strong> jobs
            </HTag>
            <HTag>
              <strong>{courses.totalCount}</strong> courses
            </HTag>
            <HTag>
              <strong>{parallels.totalCount}</strong> parallels
            </HTag>
          </Header>

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
                            <TextField type="password" {...fieldProps} />
                            {error && <ErrorMessage>{error}</ErrorMessage>}
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
                  onClick={() => setEditPasswordState(!editPasswordState)}
                >
                  Change password
                </Button>
              )}
            </ButtonCell>
          </Row>
        </Table>
      )}
    </Layout>
  );
}