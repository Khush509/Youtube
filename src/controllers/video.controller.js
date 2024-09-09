import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  const offsetValue = req.query.offset || 0;
  const limitvalue = req.query.limit || 10;

  const videos = await Video.find()
    .skip(offsetValue)
    .limit(limitvalue)
    .sort({ createdAt: "descending" });

  if (!videos) {
    throw new ApiError(404, "No videos found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    const owner = await req.user._id

    if ([title, description].some((field) => field?.trim() === "")) {
      //Check for empty fields
      throw new ApiError(400, "All fields are required");
    }

    const videoLocalPath = req.files.videoFile[0].path; // get videoFile path

    if (!videoLocalPath) {
      throw new ApiError(400, "Video field is required");
    }

    const thumbnailPath = req.files.thumbnail[0].path; // get thumbnail path

    if (!thumbnailPath) {
      throw new ApiError(400, "Thumbnail field is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath); // upload videoFile on cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailPath); // upload thumbnail on cloudinary
    // console.log(videoFile);

    if (!videoFile.url) {
      throw new ApiError(400, "Video File is required");
    }

    const duration = videoFile?.duration; // extract duration from videoFile

    if (!thumbnail.url) {
      throw new ApiError(400, "Thumbnail file is required");
    }

    const isPublished = true; // Set isPublished to true after successfully upload on cloudinary

    const video = await Video.create({
      title,
      description,
      videoFile: videoFile?.url,
      thumbnail: thumbnail?.url,
      duration,
      isPublished,
      owner
    });

    return res
      .status(201)
      .json(new ApiResponse(201, video, "Video published successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while uploading the video"
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching video"
    );
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Title and Description is required");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail file is missing");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail.url) {
      throw new ApiError(400, "Error while uploading on cloudinary");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title: title,
          description: description,
          thumbnail: thumbnail.url,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedVideo, "Video details updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating video details"
    );
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  try {
    const { videoId } = req.params;

    const video = await Video.findByIdAndDelete(videoId);

    if(!video){
      throw new ApiError(404, "Unable to find video")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting the video"
    );
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;

    const updatedVideo = await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          "Publish status toggled successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while toggling publish status"
    );
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
