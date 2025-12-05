import userHttp from "./userHttp";

// GET PROFILE
export const getProfile = async () => {
  return await userHttp.get("/api/profile/me/");
};

// UPDATE PROFILE
export const updateProfile = async (data) => {
  // User-service exposes profile updates on the same "me/" endpoint
  // (PUT /api/profile/me/), not "/api/profile/update/".
  return await userHttp.put("/api/profile/me/", data);
};

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (formData) => {
  return await userHttp.post("/api/profile/upload-image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
