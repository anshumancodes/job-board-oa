"use client";
import React, { useState, useEffect } from "react";
import { IJob, IJobForm } from "@/types/job";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface JobFormProps {
  initialData?: IJob | null;
  isEditMode: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const JobForm: React.FC<JobFormProps> = ({ initialData, isEditMode }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<IJobForm>({
    title: "",
    company: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title,
        company: initialData.company,
        location: initialData.location,
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading(
      isEditMode ? "Updating job..." : "Adding job..."
    );

    try {
      if (isEditMode && initialData) {
        const url = `${API_BASE_URL}/update/${initialData._id}`;

        await axios.put(url, formData);

        toast.success("Job updated successfully!", { id: toastId });
      } else {
        const url = `${API_BASE_URL}/create`;

        await axios.post(url, formData);

        toast.success("Job added successfully!", { id: toastId });

        setFormData({ title: "", company: "", location: "" });
      }

      router.push("/");
    } catch (error) {
      console.error("Submission error:", error);

      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : `Failed to ${isEditMode ? "update" : "add"} job.`;

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 transition duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1 text-gray-300"
        >
          Job Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium mb-1 text-gray-300"
        >
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium mb-1 text-gray-300"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-150 disabled:bg-indigo-900 disabled:opacity-75 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
      >
        {isSubmitting ? (
          <span className="flex justify-center items-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Processing...
          </span>
        ) : isEditMode ? (
          "Update Job"
        ) : (
          "Add Job"
        )}
      </button>
    </form>
  );
};

export default JobForm;
