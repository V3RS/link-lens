import { Submission } from '../types';
import SubmissionCard from './SubmissionCard';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
interface SubmissionHistoryProps {
  submissions: Submission[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const SubmissionHistory = ({
  submissions,
  currentPage,
  totalPages,
  onPageChange
}: SubmissionHistoryProps) => {
  return <section id="history-section">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      {submissions.length === 0 ? <div className="card-bg rounded-lg p-8 text-center border border-theme">
          <p className="text-secondary">
            No history yet. Your submissions will appear here.
          </p>
        </div> : <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map(submission => <SubmissionCard key={submission.id} submission={submission} />)}
          </div>
          {totalPages > 1 && <div className="flex justify-center items-center mt-6 space-x-3">
              <button 
                onClick={() => onPageChange(1)} 
                disabled={currentPage === 1} 
                className="p-2 rounded-md button-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                aria-label="First page"
                title="First page"
              >
                <ChevronsLeftIcon size={18} />
              </button>
              <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="p-2 rounded-md button-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                aria-label="Previous page"
                title="Previous page"
              >
                <ChevronLeftIcon size={18} />
              </button>
              <div className="flex items-center space-x-3 px-2">
                <span className="text-sm text-secondary whitespace-nowrap">
                  Page
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold min-w-[2ch] text-center">
                    {currentPage}
                  </span>
                  <span className="text-secondary">
                    of
                  </span>
                  <span className="font-semibold min-w-[2ch] text-center">
                    {totalPages}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-md button-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                aria-label="Next page"
                title="Next page"
              >
                <ChevronRightIcon size={18} />
              </button>
              <button 
                onClick={() => onPageChange(totalPages)} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-md button-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                aria-label="Last page"
                title="Last page"
              >
                <ChevronsRightIcon size={18} />
              </button>
            </div>}
        </>}
    </section>;
};
export default SubmissionHistory;