import {Enrollment} from "./enrollment";
import {Course} from "./course";

export interface Refund {
  id: number;
  enrollment: Enrollment;
  requestDate: Date;
  status: string;
  description?: string;
}
