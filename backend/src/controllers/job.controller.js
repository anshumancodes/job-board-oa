import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { JobModel } from "../models/job.model.js";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
});

export const createJob = asyncHandler(async (req, res) => {
  try {
    const { title, company, location } = req.body;
    if (!title || !company || !location) {
      throw new ApiError(400, "mising form values");
    }
    const isValidated = jobSchema.safeParse({ title, company, location });
    if (!isValidated.success) {
      throw new ApiError(400, "Invalid data types", parsed.error.issues);
    }
    const isJobCreated = await JobModel.create({
      title,
      company,
      location,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job: isJobCreated,
        },
        "job created sucessfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong in server while creating the job"
    );
  }
});

export const fetchAllJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await JobModel.find({});

    if (!jobs || jobs.length === 0) {
      throw new ApiError(404, "No jobs found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          jobs,
          count: jobs.length,
        },
        "Jobs fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong in server while fetching jobs"
    );
  }
});

export const updateJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location } = req.body;

    if (!id) {
      throw new ApiError(400, "Job ID is required");
    }

    if (!title || !company || !location) {
      throw new ApiError(400, "Missing form values");
    }

    const isValidated = jobSchema.safeParse({ title, company, location });
    if (!isValidated.success) {
      throw new ApiError(400, "Invalid data types", isValidated.error.issues);
    }

    const updatedJob = await JobModel.findByIdAndUpdate(
      id,
      {
        title,
        company,
        location,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job: updatedJob,
        },
        "Job updated successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong in server while updating the job"
    );
  }
});

export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Job ID is required");
    }

    const deletedJob = await JobModel.findByIdAndDelete(id);

    if (!deletedJob) {
      throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job: deletedJob,
        },
        "Job deleted successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong in server while deleting the job"
    );
  }
});
