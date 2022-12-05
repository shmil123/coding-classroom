export interface AnswerInterface {
  text: string;
  senderName: string;
  id: string;
}

export interface AssignmentInterface {
  name: string;
  question: string;
  answers: AnswerInterface[];
  id: string;
}

export interface ClassroomDataInterface {
  classroomName: string;
  ownerName: string;
  ownerID: string;
  assignments: AssignmentInterface[];
}

export default interface ClassroomInterface {
  classroomName: string;
  classroomID: string;
  ownerName: string;
}