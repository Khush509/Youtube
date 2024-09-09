import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  try {
    const subscriptionStatus = await Subscription.findOne({
      subscriber: new mongoose.Types.ObjectId(req.user._id),
      channel: new mongoose.Types.ObjectId(channelId),
    });

    if (subscriptionStatus) {
      await Subscription.deleteOne({
        subscriber: new mongoose.Types.ObjectId(req.user._id),
        channel: new mongoose.Types.ObjectId(channelId),
      });
      return res
        .status(200)
        .json(200, subscriptionStatus, "Subscription removed successfully");
    } else {
      const newSubscription = new Subscription({
        subscriber: new mongoose.Types.ObjectId(req.user._id),
        channel: new mongoose.Types.ObjectId(channelId),
      });
      await newSubscription.save();
      return res
        .status(200)
        .json(200, newSubscription, "Subscription added successfully");
    }
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while toggling subscription"
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  try {
    const subscriberList = await Subscription.find({
      channel: new mongoose.Types.ObjectId(channelId),
    }).populate("subscriber", "name");

    const subscribers = subscriberList.map(
      (subscription) => subscription.subscriber
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribers,
          "Channel subscribers fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Error fetching channel subscribers"));
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  try {
    const subscribedChannels = await Subscription.find({
      subscriber: new mongoose.Types.ObjectId(subscriberId),
    }).populate("channel", "name");
    const channels = subscribedChannels.map(
      (subscription) => subscription.channel
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channels,
          "Subscribed channels fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Error fetching subscribed channels"));
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
