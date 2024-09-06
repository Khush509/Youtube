import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  const offsetValue = req.query.offset || 0;
  const limitValue = req.query.limit || 10;

  const comments = await Comment.findById(videoId).skip(offsetValue).limit(limitValue)
  const totalComments = await Comment.countDocuments()

  return res.status(200).json(new ApiResponse(200, {totalComments: totalComments, comments}, "Comments fetched successfully"))
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    const video = Comment.findById(videoId)

    if(!video){
      throw new ApiError(404, "Video not found")
    }

    


});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
