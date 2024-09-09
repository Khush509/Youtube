import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  try {
    const { name, description } = req.body;
    const owner = await req.user._id

    if ([name, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fileds are required");
    }

    const playlist = await Playlist.create({
      name,
      description,
      owner
    });

    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating playlist"
    );
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  try {
    const { userId } = req.params;
  
    const playlist = await Playlist.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $project: {
          _id: 1,
          name:1,
          createdAt:1
        }
      }
    ])
    
    return res.status(200).json(new ApiResponse(200, {Playlists: playlist}, "User playlist fetched successfully"))
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while fetching user playlist")
  }
  
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching playlist"
    );
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // TODO: add video to playlist
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while adding video to playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
      throw new ApiError(404, "Video not found in playlist");
    }

    playlist.videos.remove(videoId);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while removing video from playlist")
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist

  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Unable to find playlist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting playlist"
    );
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ApiError(400, "All fields are required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating playlist"
    );
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
