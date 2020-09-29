import React from "react";
import { Container, Text, IconWrapper, Icon } from "./CustomBanner.styles";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import CheckIcon from '@atlaskit/icon/glyph/check';
import { useSelector } from "react-redux";

const CustomBanner = () => {
  const { showBanner, content, type } = useSelector((state) => state.banner);

  return (
    <Container visible={showBanner} type={type}>
      <IconWrapper>
        <Icon>
          {type === "warning" ? (
            <WarningIcon label="" />
          ) : type === "error" ? (
            <ErrorIcon label="" primaryColor="#ffffff" secondaryColor="#de350b"/>
          ) : type === "success" ? (
            <CheckIcon label="" />
          ) : null}
        </Icon>
      </IconWrapper>
      <Text>{content}</Text>
    </Container>
  );
};

export default CustomBanner;