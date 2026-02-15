import { ResumeInfoProvider } from "../components/resume/context/ResumeInfoContext";
import ResumeEditor from "../components/resume/ResumeEditor";

export default function CreateResume({ mode }) {
  return (
    <ResumeInfoProvider>
      <ResumeEditor mode={mode} />
    </ResumeInfoProvider>
  );
}
