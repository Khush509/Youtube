import mongoose, { mongo } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  const offsetValue = req.query.offset || 0;
  const limitValue = req.query.limit || 10;

  const comments = await Comment.find({video: new mongoose.Types.ObjectId(videoId)})
    .skip(offsetValue)
    .limit(limitValue);
    console.log(comments);
    
  const totalComments = await Comment.countDocuments({video: new mongoose.Types.ObjectId(videoId)});

  if(totalComments === 0){
    return res.status(404).json(new ApiResponse(404, {}, "No comments found"))
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalComments: totalComments, comments},
        "Comments fetched successfully"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    const comment = await Comment.create({
      video: new mongoose.Types.ObjectId(videoId),
      owner: new mongoose.Types.ObjectId(req.user._id),
      content,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while adding comment"
    );
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content
        }
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.messsage || "Something went wrong while updating comment"
    );
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
  
    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"))
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while deleting comment")
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
