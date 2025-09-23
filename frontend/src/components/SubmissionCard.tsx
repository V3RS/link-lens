import { Submission } from '../types';
import StatusBadge from './StatusBadge';
import { ExternalLinkIcon, GlobeIcon, ImageOffIcon, AlertCircleIcon } from 'lucide-react';
import { formatDisplayUrl, getRelativeTime } from '../utils';
interface SubmissionCardProps {
  submission: Submission;
  isLatest?: boolean;
}
const SubmissionCard = ({
  submission,
  isLatest = false
}: SubmissionCardProps) => {
  const {
    url,
    status,
    title,
    imageUrl,
    error,
    createdAt
  } = submission;
  const renderThumbnail = () => {
    switch (status) {
      case 'complete':
        if (imageUrl) {
          return <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <img src={imageUrl} alt={title || 'Preview image'} className="w-full h-full object-cover rounded-lg" />
            </a>;
        }
        return <div className="flex items-center justify-center h-full dark:bg-[#1E2128] light:bg-[#F0F2F5] rounded-lg">
            <ImageOffIcon size={48} className="text-[#A3A8AE] light:text-[#6B7280]" />
          </div>;
      case 'no image found':
        return <div className="flex flex-col items-center justify-center h-full dark:bg-[#1E2128] light:bg-[#F0F2F5] rounded-lg p-4">
            <ImageOffIcon size={48} className="text-[#FFB020] mb-2" />
            <p className="text-[#A3A8AE] light:text-[#6B7280] text-center text-sm">
              No image found
            </p>
          </div>;
      case 'failed':
        return <div className="flex flex-col items-center justify-center h-full dark:bg-[#1E2128] light:bg-[#F0F2F5] rounded-lg p-4">
            <AlertCircleIcon size={48} className="text-[#FF5A5F] mb-2" />
            <p className="text-[#FF5A5F] text-center text-sm">
              {error || 'Failed to fetch data'}
            </p>
          </div>;
      default:
        return <div className="flex items-center justify-center h-full dark:bg-[#1E2128] light:bg-[#F0F2F5] rounded-lg">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 dark:bg-[#2A2D36] light:bg-[#E5E7EB] rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 dark:bg-[#2A2D36] light:bg-[#E5E7EB] rounded"></div>
                  <div className="h-4 dark:bg-[#2A2D36] light:bg-[#E5E7EB] rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>;
    }
  };
  return <div className={`dark:bg-[#14161A] light:bg-white rounded-lg overflow-hidden ${isLatest ? 'dark:border-[#2A2D36] light:border-[#E5E7EB] border' : 'border border-transparent'} shadow-md`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="dark:bg-[#1E2128] light:bg-[#F0F2F5] p-2 rounded-md mr-3">
              <GlobeIcon size={16} className="text-[#33CC99]" />
            </div>
            <div>
              <h3 className="font-medium break-all line-clamp-1">
                {formatDisplayUrl(url)}
              </h3>
              {title && <p className="text-sm text-[#A3A8AE] light:text-[#6B7280] mt-1 line-clamp-1">
                  {title}
                </p>}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className={`mt-4 ${isLatest ? 'h-64' : 'h-48'} rounded-lg overflow-hidden`}>
          {renderThumbnail()}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-[#A3A8AE] light:text-[#6B7280]">
          <span>{getRelativeTime(createdAt)}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-[#33CC99] hover:underline">
            Visit site <ExternalLinkIcon size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>;
};
export default SubmissionCard;