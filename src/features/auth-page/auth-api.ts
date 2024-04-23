import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { Provider } from "next-auth/providers/index";
import OktaProvider from "next-auth/providers/okta";

const configureIdentityProvider = () => {
    const providers: Array<Provider> = [];

    if (
        process.env.AZURE_AD_CLIENT_ID &&
        process.env.AZURE_AD_CLIENT_SECRET &&
        process.env.AZURE_AD_TENANT_ID
    ) {
        providers.push(
            AzureADProvider({
                clientId: process.env.AZURE_AD_CLIENT_ID!,
                clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
                tenantId: process.env.AZURE_AD_TENANT_ID!,
                async profile(profile) {
                    const newProfile = {
                        ...profile,
                        id: profile.sub,
                        isAdmin: true, // All users from Azure AD are administrators
                    };
                    return newProfile;
                },
            })
        );
    }

    if (
        process.env.OKTA_CLIENT_ID &&
        process.env.OKTA_CLIENT_SECRET &&
        process.env.OKTA_ISSUER
    ) {
        providers.push(
            OktaProvider({
                clientId: process.env.OKTA_CLIENT_ID!,
                clientSecret: process.env.OKTA_CLIENT_SECRET!,
                issuer: process.env.OKTA_ISSUER!,
            })
        );
    }

    return providers;
};

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [...configureIdentityProvider()],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.isAdmin) {
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.user.isAdmin = token.isAdmin as boolean;
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
};

export const handlers = NextAuth(options);
