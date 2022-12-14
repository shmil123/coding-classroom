import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AssignmentInterface } from "../../types";
import { useRouter } from "next/router";
import Calendar from "react-calendar";

interface Props {
  assignments: AssignmentInterface[];
  changeAssignments: (assignmentArray: AssignmentInterface[]) => void;
}

const EditAssignmentForm: React.FC<Props> = ({
  assignments,
  changeAssignments,
}) => {
  const [name, setName] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const router = useRouter();
  const { classroomID, assignmentID } = router.query;

  useEffect(() => {
    const getAssignmentData = async () => {
      const classroomDocumentReference = doc(
        database,
        `classrooms/${classroomID}`
      );

      try {
        const classroomDocumentSnapshot = await getDoc(
          classroomDocumentReference
        );

        const data = classroomDocumentSnapshot.data();

        changeAssignments(data?.assignments ?? []);
      } catch {
        alert("Failed to load the assignment");
      }
    };

    if (!assignments) getAssignmentData();
    else {
      const assignment = assignments.find(
        (currentAssignment) => currentAssignment.id === assignmentID
      );

      if (assignment) {
        const currentYear = new Date().getFullYear();
        const assignmentMonth = assignment.until.slice(0, 3);
        const assignmentDate = assignment.until.slice(4);

        const dateFormat = new Date(
          `${assignmentMonth} ${assignmentDate}, ${currentYear}`
        );

        setName(assignment.name);
        setQuestion(assignment.question);
        setDate(dateFormat);
      }
    }
  }, [classroomID, assignmentID, assignments, changeAssignments]);

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const changeQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setQuestion(event.target.value);

  const editAssignment = async () => {
    if (!name || !question || !date || typeof assignmentID !== "string") return;

    const noUnnecessarySpacesName = name.trim().replace(/\s{2,}/g, " ");
    if (noUnnecessarySpacesName === "" || question.replaceAll(" ", "") === "")
      return;

    const shortenedDate = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;

    const classroomDocumentReference = doc(
      database,
      `classrooms/${classroomID}`
    );

    const newAssignment: AssignmentInterface = {
      name: noUnnecessarySpacesName,
      question,
      until: shortenedDate,
      answers: [],
      id: assignmentID,
    };

    const assignmentIndex = assignments.findIndex(
      (currentAssignment) => currentAssignment.id === assignmentID
    );

    const newAssignments = [...assignments];
    newAssignments[assignmentIndex] = newAssignment;

    try {
      await updateDoc(classroomDocumentReference, {
        assignments: newAssignments,
      });
    } catch {
      alert("Failed to edit the assignment");
    }

    changeAssignments(newAssignments);
    router.push(`/classrooms/${classroomID}/assignments/${assignmentID}`);
  };

  const validateAssignment = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!name || !question || !date) return;

    const noUnnecessarySpacesName = name.trim().replace(/\s{2,}/g, " ");

    if (noUnnecessarySpacesName === "") {
      alert("Cannot edit the assignment to not have a name");
      setName("");
    } else if (question.replaceAll(" ", "") === "") {
      alert("Cannot edit the assignment to not have a question");
      setQuestion("");
    } else editAssignment();
  };

  return (
    <>
      {name && date && question ? (
        <form className="flex justify-center mb-10">
          <div className="w-1/2 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center w-full">
              <div className="flex justify-start w-4/5">
                <label htmlFor="name" className="text-2xl font-bold">
                  Name
                </label>
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={changeName}
                autoFocus
                className="w-4/5 text-3xl p-3 rounded-md outline-none bg-gray-100 focus:bg-gray-200 transition-colors"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Until</h2>

              <Calendar
                value={date}
                onChange={setDate}
                calendarType="US"
                minDate={new Date()}
                view="month"
                locale="en-US"
              />
            </div>

            <div className="flex flex-col items-center w-full">
              <div className="flex justify-start w-full">
                <label htmlFor="question" className="text-2xl font-bold">
                  Question
                </label>
              </div>
              <textarea
                name="question"
                id="question"
                value={question}
                onChange={changeQuestion}
                className="w-full h-96 text-3xl p-3 rounded-md outline-none bg-gray-100 focus:bg-gray-200 transition-colors"
              />
            </div>

            <input
              type="submit"
              value="Save"
              onClick={validateAssignment}
              className="mt-5 bg-gray-900 text-white py-3 px-12 rounded-lg font-bold text-3xl uppercase cursor-pointer hover:bg-gray-800 transition-colors"
            />
          </div>
        </form>
      ) : (
        <p className="text-center text-2xl">Failed to load the assignment</p>
      )}
    </>
  );
};

export default EditAssignmentForm;
