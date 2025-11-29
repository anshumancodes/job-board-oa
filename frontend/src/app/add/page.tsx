"use client";

import JobForm from "@/components/JobForm";
import {Plus} from "lucide-react"

const AddJobPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl flex item-center  gap-4 font-extrabold text-white mb-6 border-b border-gray-700 pb-2">
        <Plus/> Post a New Job
      </h1>
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <JobForm isEditMode={false} initialData={null} />
      </div>
    </div>
  );
};

export default AddJobPage;
