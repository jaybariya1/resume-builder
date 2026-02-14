import { ResumeInfoProvider } from "../context/ResumeInfoContext";
import ResumeEditor from "../components/ResumeEditor";

export default function CreateResume({ mode }) {
  return (
    <ResumeInfoProvider>
      <ResumeEditor mode={mode} />
    </ResumeInfoProvider>
  );
}
