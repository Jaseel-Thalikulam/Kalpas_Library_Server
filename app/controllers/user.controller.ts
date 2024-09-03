import { Request, Response } from "express";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   


    res.status(201).json({ message: "User registered successfully" });


  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {

    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};

