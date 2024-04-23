import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { Provider } from "next-auth/providers/index";

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
            // Check if the user belongs to the 'LoyalGPT_Admins' group
            const groups = profile.groups || [];
            const isAdmin = groups.includes("LoyalGPT_Admins");
            const newProfile = {
              ...profile,
              id: profile.sub,
              isAdmin: isAdmin,
            };
            return newProfile;
          },
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