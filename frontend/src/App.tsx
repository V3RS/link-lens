import { Toaster } from 'sonner';
import { GithubIcon, GlobeIcon } from 'lucide-react';
import Header from './components/Header';
import SubmitForm from './components/SubmitForm';
import LatestSubmission from './components/LatestSubmission';
import SubmissionHistory from './components/SubmissionHistory';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import { useTheme, useSubmissions, usePagination } from './hooks';
import { EXTERNAL_LINKS } from './constants';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { submissions, isLoading, handleSubmit, handleAddMockData } = useSubmissions();
  
  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const historySubmissions = submissions.length > 1 ? submissions.slice(1) : [];
  
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedSubmissions,
    handlePageChange,
    resetToFirstPage,
  } = usePagination(historySubmissions);

  const handleMockDataWithReset = () => {
    handleAddMockData();
    resetToFirstPage();
  };
  return <div className="min-h-screen app-bg flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="flex justify-between items-center">
          <Header />
          <div className="flex items-center space-x-3">
            <a href={EXTERNAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full button-bg transition-colors" aria-label="GitHub Repository">
              <GithubIcon size={20} className="text-theme" />
            </a>
            <a href={EXTERNAL_LINKS.PORTFOLIO} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full button-bg transition-colors" aria-label="Veer Singh's Portfolio">
              <GlobeIcon size={20} className="text-theme" />
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
        <main className="mt-8 space-y-8">
          <SubmitForm onSubmit={handleSubmit} onAddMockData={handleMockDataWithReset} isLoading={isLoading} />
          <LatestSubmission submission={latestSubmission} />
          <SubmissionHistory submissions={paginatedSubmissions} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>;
}