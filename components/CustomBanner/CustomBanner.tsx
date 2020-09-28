import React, { ReactComponentElement } from "react";
import { Container, Text, IconWrapper, Icon } from "./CustomBanner.styles";

interface ICustomBannerProps {
    children: string,
    icon: React.ReactNode
}

const CustomBanner = ({children, icon}) => (
    <Container>
        <IconWrapper>
            <Icon>
                {icon}
            </Icon>
        </IconWrapper>
        <Text>
            {children}
        </Text>
    </Container>
);

export default CustomBanner;