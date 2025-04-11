import { LoginCredential, SignUpCredential, UserAccountDto } from "@/lib/types";
import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<boolean, SignUpCredential>({
      query: (newUserCredentials) => ({
        url: "/v1/auth/signup",
        method: "POST",
        body: newUserCredentials,
      }),
    }),
    login: builder.mutation<UserAccountDto, LoginCredential>({
      query: (userCredentials) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: userCredentials,
      }),
    }),
    userSession: builder.query<UserAccountDto | undefined, void>({
      query: () => ({
        url: "/v1/auth/userSession",
      }),
    })
  }),
});

export const { useLoginMutation, useSignupMutation, useUserSessionQuery } = authApi;
