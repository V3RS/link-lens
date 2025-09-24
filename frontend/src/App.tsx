import { Toaster } from 'sonner';
import { GithubIcon, GlobeIcon } from 'lucide-react';
import Header from './components/Header';
import SubmitForm from './components/SubmitForm';
import LatestSubmission from './components/LatestSubmission';
import SubmissionHistory from './components/SubmissionHistory';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import { useTheme, useSubmissions } from './hooks';
import { EXTERNAL_LINKS } from './constants';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { 
    latestSubmission,
    historySubmissions, 
    pagination, 
    isLoading, 
    isPolling, 
    handleSubmit, 
    handlePageChange 
  } = useSubmissions();

  return <div className="min-h-screen app-bg flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Header />
            {isPolling && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">Updating...</span>
              </div>
            )}
          </div>
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
          <SubmitForm onSubmit={handleSubmit} isLoading={isLoading} />
          <LatestSubmission submission={latestSubmission} />
          <SubmissionHistory 
            submissions={historySubmissions} 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={handlePageChange} 
          />
        </main>
      </div>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>;
}