import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  try {
    const { content } = req.body;
    const { userId } = req.params;

    const tweet = await Tweet.create({
      owner: new mongoose.Types.ObjectId(userId),
      content,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while creating tweet"
    );
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  try {
    const tweet = await Tweet.find({
      owner: new mongoose.Types.ObjectId(userId),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "User tweets fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while fetching user tweets"
    );
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while updating tweet"
    );
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  try {
    await Tweet.findByIdAndDelete(tweetId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while deleting tweet"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
