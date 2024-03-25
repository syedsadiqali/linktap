import LinkTapLogo from "@/components/LinkTapLogo";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WaitlistEnterEmailProps {
  userEmail: string;
}


export const WaitlistEnter = ({ userEmail }: WaitlistEnterEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <LinkTapLogo style={logo} />
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>You&apos;re on LinkTap Waitlist!</Text>
        <Text style={paragraph}>
          We will send on you an email when you&apos;re ready to Sign-Up!
        </Text>
        <Text style={paragraph}>
          Best,
          <br />
          The LinkTap team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>All rights reserved!</Text>
      </Container>
    </Body>
  </Html>
);

WaitlistEnter.PreviewProps = {
  userEmail: "test@user.com",
} as WaitlistEnterEmailProps;

export default WaitlistEnter;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  width: "100%",
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
