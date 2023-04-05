import instance from "./axiosInstance";

export const register = ({
  name,
  email,
  password,
  tutor,
}: {
  name: string;
  email: string;
  password: string;
  tutor: boolean;
}) => {
  return instance.post("/base/auth/register", { name, email, password, tutor });
};

export const login = async ({
  email,
  password,
  tutor,
}: {
  email: string;
  password: string;
  tutor: boolean;
}) => {
  const result = await instance.post("/base/auth/login", {
    email,
    password,
    tutor,
  });
  return result.data;
};

export const googleLogin = async ({
  credential,
  tutor,
}: {
  credential: string;
  tutor: boolean;
}) => {
  const result = await instance.post("/base/auth/googleLogin", {
    credential,
    tutor,
  });
  return result.data;
};

export const googleRegister = ({
  credential,
  tutor,
}: {
  credential: string;
  tutor: boolean;
}) => {
  return instance.post("/base/auth/googleRegister", { credential, tutor });
};

export const logout = async () => {
  return instance.post("/base/auth/logout");
};

export const becomeTutor = async () => {
  const result = await instance.post("/base/auth/becomeTutor");
  return result.data;
};

export const forgotPassword = ({ email }: { email: string }) => {
  return instance.post("/base/auth/forgotPassword", { email });
};

export const resetPassword = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return instance.post("/base/auth/resetPassword", { token, password });
};

export const changeEmail = ({
  password,
  newEmail,
}: {
  password: string;
  newEmail: string;
}) => {
  return instance.post("/base/auth/changeEmail", { newEmail, password });
};

export const changePassword = ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  return instance.post("/base/auth/changePassword", {
    oldPassword,
    newPassword,
  });
};

export const requestEmailVerification = async ({
  userId,
}: {
  userId: string;
}) => {
  const result = await instance.post("/base/auth/requestEmailVerification", {
    id: userId,
  });
  return result.data;
};

export const verifyEmailViaToken = async ({ token }: { token: string }) => {
  const result = await instance.post("/base/auth/verifyEmailViaToken", {
    token,
  });
  return result.data;
};

export const verifyEmailViaGoogle = async ({
  credential,
  id,
}: {
  credential: string;
  id: string;
}) => {
  const result = await instance.post("/base/auth/verifyEmailViaGoogle", {
    credential,
    id,
  });
  return result.data;
};
