import userHttp from "./userHttp";

// GET PROFILE
export const getProfile = async () => {
  return await userHttp.get("/api/me/");
};

// CREATE PROFILE
export const createProfile = async (data) => {
  return await userHttp.post("/api/", data);
};

// UPDATE PROFILE
export const updateProfile = async (data) => {
  // Use PATCH for partial updates, safer than PUT
  return await userHttp.patch("/api/me/", data);
};

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (formData) => {
  return await userHttp.post("/api/upload-image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
