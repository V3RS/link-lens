import { SubmissionStatus } from '../types';
import { ClockIcon, LoaderIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from 'lucide-react';
interface StatusBadgeProps {
  status: SubmissionStatus;
}
const StatusBadge = ({
  status
}: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'queued':
        return {
          icon: ClockIcon,
          text: 'Queued',
          bgColor: 'bg-[#2A2D36] light:bg-[#E5E7EB]',
          textColor: 'text-[#A3A8AE] light:text-[#6B7280]'
        };
      case 'processing':
        return {
          icon: LoaderIcon,
          text: 'Processing',
          bgColor: 'bg-[#8AA4FF]/20',
          textColor: 'text-[#8AA4FF]'
        };
      case 'complete':
        return {
          icon: CheckCircleIcon,
          text: 'Complete',
          bgColor: 'bg-[#33CC99]/20',
          textColor: 'text-[#33CC99]'
        };
      case 'no image found':
        return {
          icon: AlertTriangleIcon,
          text: 'No Image Found',
          bgColor: 'bg-[#FFB020]/20',
          textColor: 'text-[#FFB020]'
        };
      case 'failed':
        return {
          icon: XCircleIcon,
          text: 'Failed',
          bgColor: 'bg-[#FF5A5F]/20',
          textColor: 'text-[#FF5A5F]'
        };
      default:
        return {
          icon: ClockIcon,
          text: 'Unknown',
          bgColor: 'bg-[#2A2D36] light:bg-[#E5E7EB]',
          textColor: 'text-[#A3A8AE] light:text-[#6B7280]'
        };
    }
  };
  const {
    icon: Icon,
    text,
    bgColor,
    textColor
  } = getStatusConfig();
  return <div className={`inline-flex items-center px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
      <Icon size={14} className="mr-1" />
      <span className="text-xs font-medium">{text}</span>
    </div>;
};
export default StatusBadge;