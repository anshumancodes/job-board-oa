import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { JobModel } from "../models/job.model.js";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
});

export const createJob = asyncHandler(async (req, res) => {
  const { title, company, location } = req.body;

  // Validate input with Zod
  const validation = jobSchema.safeParse({ title, company, location });

  if (!validation.success) {
    const errorMessages = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    throw new ApiError(400, errorMessages);
  }

  // Create job in database
  const job = await JobModel.create({
    title,
    company,
    location,
  });

  // Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, { job }, "Job created successfully"));
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

export const fetchJobById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Job ID is required");
    }

    const job = await JobModel.findById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        job,
        "Job fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong in server while fetching the job"
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
      "Something went wrong in server while updating the job",
      error
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
