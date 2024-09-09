import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const videoLikeStatus = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  });

  if (videoLikeStatus) {
    await Like.deleteOne({
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, videoLikeStatus, "Like removed successfully"));
  } else {
    const newLike = new Like({
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(200, newLike, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  const commentLikeStatus = await Like.findOne({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  });

  if (commentLikeStatus) {
    await Like.deleteOne({
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, commentLikeStatus, "Like removed successfully")
      );
  } else {
    const newLike = new Like({
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(200, newLike, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const tweetLikeStatus = await Like.findOne({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  });

  if (tweetLikeStatus) {
    await Like.deleteOne({
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, tweetLikeStatus, "Like removed successfully"));
  } else {
    const newLike = new Like({
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(200, newLike, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const { offset = 0, limit = 10 } = req.query

  const offsetValue = req.query.offset || 0;
  const limitValue = req.query.limit || 10;

 try {
    const likedVideos = await Like.find({likedBy: new mongoose.Types.ObjectId(req.user._id)}).skip(offsetValue).limit(limitValue).populate('video')

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos fetched successfully"))
 } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching liked videos")
 }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
