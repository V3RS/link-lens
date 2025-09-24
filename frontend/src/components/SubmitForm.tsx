import { useState } from 'react';
interface SubmitFormProps {
  onSubmit: (url: string) => void;
  onAddMockData: () => void;
  isLoading: boolean;
}
const SubmitForm = ({
  onSubmit,
  onAddMockData,
  isLoading
}: SubmitFormProps) => {
  const [url, setUrl] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };
  return <section className="card-bg rounded-lg p-6 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex-grow">
            <label htmlFor="url-input" className="block mb-2 font-medium">
              Website URL
            </label>
            <input id="url-input" type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-4 py-3 rounded-lg input-bg border-theme border text-theme placeholder-theme focus:outline-none focus:ring-2 focus:ring-[#33CC99]" disabled={isLoading} />
            <p className="mt-2 text-sm text-secondary">
              We will fetch the page in the background and show the preview
              image if available.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button type="submit" disabled={isLoading || !url.trim()} className="px-6 py-3 bg-[#33CC99] text-white font-medium rounded-lg hover:bg-[#2BB788] focus:outline-none focus:ring-2 focus:ring-[#33CC99] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]">
              {isLoading ? <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span> : 'Submit'}
            </button>
            <button type="button" onClick={onAddMockData} className="px-6 py-3 button-bg text-theme font-medium rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[#5B9DFF] focus:ring-opacity-50 min-w-[120px]">
              Add Mock Data
            </button>
          </div>
        </div>
      </form>
    </section>;
};
export default SubmitForm;