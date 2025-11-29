'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import JobForm from '@/components/JobForm';
import { Job } from '@/types/job';
import toast from 'react-hot-toast';
import { Edit } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

const EditJobPage: React.FC = () => {
  const params = useParams();
  const jobId = params.id as string;

  const [jobData, setJobData] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const response = await axios.get<Job>(`${API_BASE_URL}/${jobId}`);
          // @ts-ignore
          setJobData(response.data.data);
        } catch (error) {
          toast.error('Failed to load job details for editing.');
          console.error('Error fetching job for edit:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-8 text-center text-gray-400">
        Loading job details...
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="container mx-auto p-4 sm:p-8 text-center text-red-400">
        Job not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-extrabold text-white mb-6 border-b border-gray-700 pb-2"><Edit/> Edit Job Posting</h1>
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        {/* @ts-ignore */}
        <JobForm isEditMode={true} initialData={jobData} />
      </div>
    </div>
  );
};

export default EditJobPage;
