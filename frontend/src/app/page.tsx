'use client';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IJob } from '@/types/job';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch`);
      setJobs(response.data.data.jobs);
    } catch (error) {
      toast.error('Failed to fetch job postings.');
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading('Deleting job...');
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      toast.success('Job deleted successfully!', { id: toastId });
      setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
    } catch (error) {
      toast.error('Failed to delete job.', { id: toastId });
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          Job Board
        </h1>
        <Link href="/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-500/50">
          + Add New Job
        </Link>
      </header>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Loading job postings...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No jobs posted yet. Be the first!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListPage;
