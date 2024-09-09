import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  try {
    const totalVideos = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(req.user._id) });

    const totalViewsResult = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

    const totalSubscribers = await Subscription.countDocuments({ channel: new mongoose.Types.ObjectId(req.user._id) });

    const totalLikesResult = await Like.aggregate([
      { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoData" } },
      { $unwind: "$videoData" },
      { $match: { "videoData.owner": new mongoose.Types.ObjectId(req.user._id) } },
      { $count: "totalLikes" }
    ]);
    const totalLikes = totalLikesResult.length > 0 ? totalLikesResult[0].totalLikes : 0;

    const stats = {
      totalVideos,
      totalViews,
      totalSubscribers,
      totalLikes,
    };

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Error fetching channel stats"));
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { offset = 0, limit = 10 } = req.query;

  try {
    const offsetValue = parseInt(req.query.offset) || 0;
    const limitValue = parseInt(req.query.limit) || 10;
  
    const totalUploadedVideos = await Video.find({
      owner: new mongoose.Types.ObjectId(req.user._id),
    })
      .skip(offsetValue)
      .limit(limitValue);
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          totalUploadedVideos,
          "Uploaded videos fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching uploaded videos")
  }
});

export { getChannelStats, getChannelVideos };
