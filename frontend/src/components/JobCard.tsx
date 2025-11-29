import React from "react";
import { IJob } from "@/types/job";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface JobCardProps {
  job: IJob;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete }) => {
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete the job: ${job.title}?`)
    ) {
      onDelete(job._id);
    }
  };

  return (
    <div
      className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer border border-gray-700"
      onClick={() => router.push(`/edit/${job._id}`)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-indigo-400">{job.title}</h3>
        <button
          onClick={handleDeleteClick}
          className="text-red-400 hover:text-red-300 transition duration-150 p-2 rounded-full hover:bg-gray-700 focus:outline-none"
          aria-label={`Delete ${job.title}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-lg font-semibold text-gray-200 mb-1">{job.company}</p>
      <p className="text-sm text-gray-400 mb-4">{job.location}</p>
    </div>
  );
};

export default JobCard;
