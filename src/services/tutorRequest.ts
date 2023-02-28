import instance from "./axiosInstance";

export const createTutorRequest = ({
  name,
  contactInfo,
  postalCode,
  region,
  gender,
  level,
  subjects,
  type,
  pricing,
  availability,
  description,
}: {
  name: string;
  contactInfo: { email: string };
  postalCode: string;
  region: string;
  gender: string[];
  level: string;
  subjects: string[];
  type: string;
  pricing: {
    rate: string;
    rateOption: string;
  };
  availability: string;
  description: string;
}) => {
  return instance.post("/tutor/request", {
    name,
    contactInfo,
    postalCode,
    region,
    gender,
    level,
    subjects,
    type,
    pricing,
    availability,
    description,
  });
};

export const replaceTutorRequest = ({
  id,
  name,
  contactInfo,
  postalCode,
  region,
  gender,
  level,
  subjects,
  type,
  pricing,
  availability,
  description,
}: {
  id: string;
  name: string;
  contactInfo: { email: string };
  postalCode: string;
  region: string;
  gender: string[];
  level: string;
  subjects: string[];
  type: string;
  pricing: {
    rate: string;
    rateOption: string;
  };
  availability: string;
  description: string;
}) => {
  return instance.put("/tutor/request", {
    id,
    name,
    contactInfo,
    postalCode,
    region,
    gender,
    level,
    subjects,
    type,
    pricing,
    availability,
    description,
  });
};

export const deleteTutorRequest = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/request/${id}`);
};

export const getTutorRequest = async ({ id }: { id: string }) => {
  const result = await instance.get(`/tutor/request/${id}`);
  return result.data;
};

// TODO: add more filters
export const getTutorRequests = ({ searchQuery }: { searchQuery?: string }) => {
  return instance.get(`/tutor/request`, {
    params: { search: searchQuery },
  });
};
