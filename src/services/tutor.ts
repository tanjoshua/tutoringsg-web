import instance from "./axiosInstance";

export const createTutorProfile = async ({
  urlId,
  isPublic,
  title,
  gender,
  regions,
  tutorName,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  urlId: string;
  isPublic: boolean;
  title: string;
  gender: string;
  regions: string[];
  tutorName: string;
  levels: string[];
  subjects: {
    primary: string[];
    lowerSecondary: string[];
    upperSecondary: string[];
    jc: string[];
    other: string[];
  };
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: string; details: string };
  contactInfo: { phoneNumber?: string; email?: string; telegram?: string };
}) => {
  const result = await instance.post("/tutor", {
    urlId,
    isPublic,
    title,
    tutorName,
    gender,
    regions,
    levels,
    subjects,
    type,
    qualifications,
    description,
    pricing: {
      ...pricing,
      rate: +pricing.rate,
    },
    contactInfo,
  });
  return result.data;
};

export const replaceTutorProfile = async ({
  id,
  urlId,
  isPublic,
  title,
  gender,
  regions,
  tutorName,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  id: string;
  urlId: string;
  isPublic: boolean;
  title: string;
  gender: string;
  regions: string[];
  tutorName: string;
  levels: string[];
  subjects: {
    primary: string[];
    lowerSecondary: string[];
    upperSecondary: string[];
    jc: string[];
    other: string[];
  };
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: string; details: string };
  contactInfo: { phoneNumber?: string; email?: string; telegram?: string };
}) => {
  return instance.put("/tutor", {
    id,
    urlId,
    isPublic,
    tutorName,
    gender,
    regions,
    title,
    levels,
    subjects,
    type,
    qualifications,
    description,
    contactInfo,
    pricing: {
      ...pricing,
      rate: +pricing.rate,
    },
  });
};

export const deleteTutorProfile = async ({ id }: { id: string }) => {
  return instance.delete(`/tutor/${id}`);
};

export const getTutorProfile = async ({ urlId }: { urlId: string }) => {
  const result = await instance.get(`/tutor/${urlId}`);
  return result.data;
};

export const getPublicTutorProfiles = async ({
  search,
  regions,
  gender,
  levelCategories,
  subjects,
  type,
  page,
  limit,
  sortBy,
}: {
  search?: string;
  regions?: string[];
  gender?: string[];
  levelCategories?: string[];
  subjects?: any;
  type?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
}) => {
  const result = await instance.post(`/tutor/getPublicProfiles`, {
    search,
    regions,
    gender,
    levelCategories,
    subjects,
    type,
    page,
    limit,
    sortBy,
  });
  return result.data;
};

export const getUserTutorProfile = async () => {
  const result = await instance.get("tutor/me");
  return result.data;
};

export const getTutorLevels = async () => {
  const result = await instance.get("tutor/levels");
  return result.data;
};

export const uploadProfilePicture = async (image: Blob) => {
  const formData = new FormData();
  formData.append("profilePicture", image);
  const result = await instance.post("tutor/uploadProfilePicture", formData);
  return result.data;
};
