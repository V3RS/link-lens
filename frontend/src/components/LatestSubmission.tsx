import { Submission } from '../types';
import SubmissionCard from './SubmissionCard';
interface LatestSubmissionProps {
  submission: Submission | null;
}
const LatestSubmission = ({
  submission
}: LatestSubmissionProps) => {
  return <section>
      <h2 className="text-xl font-semibold mb-4">Latest submission</h2>
      {submission ? <SubmissionCard submission={submission} isLatest={true} /> : <div className="dark:bg-[#14161A] light:bg-white rounded-lg p-8 text-center dark:border-[#2A2D36] light:border-[#E5E7EB] border">
          <p className="text-[#A3A8AE] light:text-[#6B7280]">
            No links yet. Paste a link to get started.
          </p>
        </div>}
    </section>;
};
export default LatestSubmission;