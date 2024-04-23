"use client";
import { AI_NAME } from "@/features/theme/theme-config";
import { signIn } from "next-auth/react";
import { FC } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface LoginProps {
  isDevMode: boolean;
}

export const LogIn: FC<LoginProps> = (props) => {
  return (
      <Card className="flex gap-2 flex-col min-w-[300px]">
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={"ai-icon.png"} />
            </Avatar>
            <span className="text-primary">{AI_NAME}</span>
          </CardTitle>
          <CardDescription>
            <b>This model is hosted in the Loyal Source GCC Cloud.</b><br/>
            All activities within LoyalGPT are subject to monitoring and surveillance. By logging in, you consent to the collection and analysis of your interactions for security purposes. Unauthorized access or misuse may lead to legal consequences. Proceeding beyond this point indicates your acceptance of these terms.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => signIn("okta")}> Sign in with Okta </Button>
          <Button onClick={() => signIn("azure-ad")}> Sign in as Admin </Button>

          {props.isDevMode ? (
              <Button onClick={() => signIn("localdev")}>
                Basic Auth (DEV ONLY)
              </Button>
          ) : null}
        </CardContent>
      </Card>
  );
};
