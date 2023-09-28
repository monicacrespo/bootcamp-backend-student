import { Role } from 'common-app/models';
import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  email: string;
  password: string;
  salt: string;
  role: Role;
}
