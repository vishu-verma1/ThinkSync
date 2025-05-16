import userModel from "../models/user.model.js";

export const createUser = async ({ email, password ,username}) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const hash = await userModel.hashPassword(password);

    const user = await userModel.create({
      username,
      email,
      password: hash,

    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);

    throw new Error("Internal Server Error. Please try again later.");
  }
};

export const getAllUser = async (userId) => {
  const users = await userModel.find({ _id: { $ne: userId } });
  return users;
};
