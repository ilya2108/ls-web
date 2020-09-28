import styled from "styled-components";

export const Container = styled.div`
  height: 52px;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;

  overflow: hidden;
  transition: max-height 0.25s ease-in-out 0s;

  background-color: rgb(255, 171, 0);
  color: rgb(37, 56, 88);
  fill: rgb(255, 171, 0);
  webkit-box-align: center;
  align-items: center;
  display: flex;
  font-weight: 500;
  -webkit-box-pack: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  margin: auto;
  transition: color 0.25s ease-in-out 0s;
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
  color: currentcolor;
  fill: inherit;
  display: inline-block;
  flex-shrink: 0;
  line-height: 1;
`;