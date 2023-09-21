import { Status } from "@prisma/client";

export interface User{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: Status;
}