import styled from "styled-components";

const warning = `
  background-color: #ffab00;
  color: #253858;
  fill: #ffab00;
`;

const success = `
  background-color: #00875A;
  color: #ffffff;
  fill: #00875A;
`;

const error = `
  background-color: #de350b;
  color: #ffffff;
  fill: #de350b;
`;

export const Container = styled.div`
  max-height: ${(props) => (props.visible ? "52px" : "0px")};
  width: 100%;

  overflow: hidden;
  transition: max-height 0.25s ease-in-out 0s;

  ${(props) =>
    props.type === "success"
      ? success
      : props.type === "warning"
      ? warning
      : props.type === "error"
      ? error
      : null}
  box-align: center;
  align-items: center;
  display: flex;
  font-weight: 500;
  -webkit-box-pack: center;
  justify-content: center;
  text-align: center;
  padding: ${(props) => (props.visible ? "12px" : "0px")};
  margin: auto;
`;
export const Text = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 1 auto;
  padding: 4px;
  overflow: hidden;
`;
export const IconWrapper = styled.span`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;
export const Icon = styled.span`
  display: inline-block;
  flex-shrink: 0;
  line-height: 1;
`;