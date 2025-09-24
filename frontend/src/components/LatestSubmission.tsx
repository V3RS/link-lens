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
      {submission ? <SubmissionCard submission={submission} isLatest={true} /> : <div className="card-bg rounded-lg p-8 text-center border-theme border">
          <p className="text-secondary">
            No links yet. Paste a link to get started.
          </p>
        </div>}
    </section>;
};
export default LatestSubmission;