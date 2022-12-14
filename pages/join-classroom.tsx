import Head from "next/head";
import Title from "../components/general/Title";
import JoinClassroomForm from "../components/join-classroom/JoinClassroomForm";

const JoinClassroomPage: React.FC = () => (
  <>
    <Head>
      <title>Join Classroom | SchoolBit</title>
    </Head>

    <Title title="Join Classroom" />

    <JoinClassroomForm />
  </>
);

export default JoinClassroomPage;
