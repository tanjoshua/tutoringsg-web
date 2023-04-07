import instance from "./axiosInstance";

export const testimonialExists = async ({
  profileId,
}: {
  profileId: string;
}) => {
  const result = await instance.get(`/tutor/testimonial/exists`, {
    params: {
      profileId,
    },
  });

  return result.data;
};
export const getTestimonials = async ({
  profileId,
  page,
  limit,
}: {
  profileId: string;
  page: number;
  limit: number;
}) => {
  const result = await instance.get(`/tutor/testimonials`, {
    params: {
      page,
      limit,
      profileId,
    },
  });

  return result.data;
};

export const postTestimonial = async ({
  tutorProfile,
  title,
  testimonial,
}: {
  tutorProfile: string;
  title: string;
  testimonial: string;
}) => {
  return instance.post(`/tutor/testimonial`, {
    tutorProfile,
    title,
    testimonial,
  });
};

export const deleteTestimonial = async ({ id }: { id: string }) => {
  return instance.delete(`/tutor/testimonial/${id}`);
};
