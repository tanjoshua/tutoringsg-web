import instance from "./axiosInstance";

export const createTutorProfile = ({
  title,
  tutorName,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  title: string;
  tutorName: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: string; details: string };
  contactInfo: { phoneNumber?: string; email?: string };
}) => {
  return instance.post("/tutor", {
    title,
    tutorName,
    levels,
    subjects,
    type,
    qualifications,
    description,
    pricing,
    contactInfo,
  });
};

export const replaceTutorProfile = ({
  id,
  title,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  id: string;
  title: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: number; details: string };
  contactInfo: { phoneNumber?: number; email?: string };
}) => {
  return instance.put("/tutor", {
    id,
    title,
    levels,
    subjects,
    type,
    qualifications,
    description,
    pricing,
    contactInfo,
  });
};

export const deleteTutorProfile = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/${id}`);
};

export const getTutorProfile = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/${id}`);
};

export const getPublicTutorProfiles = ({
  searchQuery,
  levelFilter,
}: {
  searchQuery?: string;
  levelFilter?: string[];
}) => {
  return instance.get(`/tutor`, {
    params: { search: searchQuery, level: levelFilter },
  });
};

export const getUserTutorProfile = async () => {
  const result = await instance.get("tutor/me");
  return result.data;
};

export const getTutorLevels = async () => {
  const result = await instance.get("tutor/levels");
  return result.data;
};
