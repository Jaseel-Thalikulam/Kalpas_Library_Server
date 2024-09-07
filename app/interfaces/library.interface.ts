import { Types } from "mongoose";

export interface ILibrary extends Document {
  libraryName: string;
  place: string;
  libraryManager: Types.ObjectId;
}
