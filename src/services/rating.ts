import instance from "./axiosInstance";

export const ratingExists = async ({ profileId }: { profileId: string }) => {
  const result = await instance.get(`/tutor/rating/exists`, {
    params: {
      profileId,
    },
  });

  return result.data;
};
export const getRatings = async ({
  profileId,
  page,
  limit,
}: {
  profileId: string;
  page: number;
  limit: number;
}) => {
  const result = await instance.get(`/tutor/ratings`, {
    params: {
      page,
      limit,
      profileId,
    },
  });

  return result.data;
};

export const getUserRatings = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const result = await instance.get(`/tutor/userRatings`, {
    params: {
      page,
      limit,
    },
  });

  return result.data;
};

export const postRating = async ({
  tutorProfile,
  rating,
  testimonial,
}: {
  tutorProfile: string;
  rating: number;
  testimonial: string;
}) => {
  return instance.post(`/tutor/rating`, {
    tutorProfile,
    rating,
    testimonial,
  });
};

export const deleteRating = async ({ id }: { id: string }) => {
  return instance.delete(`/tutor/rating/${id}`);
};

export const requestRating = async ({
  email,
  message,
}: {
  email: string;
  message: string;
}) => {
  const result = await instance.post("/tutor/rating/request", {
    email,
    message,
  });
  return result.data;
};

export const verifyRatingRequest = async ({ token }: { token: string }) => {
  const result = await instance.post("/tutor/rating/verifyRequest", { token });
  return result.data;
};

export const fulfilRatingRequest = async ({
  token,
  rating,
  testimonial,
  name,
}: {
  token: string;
  rating: number;
  testimonial: string;
  name: string;
}) => {
  const result = await instance.post("/tutor/rating/fulfilRequest", {
    token,
    rating,
    testimonial,
    name,
  });
  return result.data;
};
