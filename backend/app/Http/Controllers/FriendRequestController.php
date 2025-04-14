<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    // Get all friend requests
    public function index()
    {
        return response()->json(FriendRequest::all(), 200);
    }

    // Create a new friend request
    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $friendRequest = FriendRequest::create($request->all());

        return response()->json($friendRequest, 201);
    }

    // Get a specific friend request by ID
    public function show($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);

        return response()->json($friendRequest, 200);
    }

    // Update a friend request
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        $friendRequest = FriendRequest::findOrFail($id);
        $friendRequest->update($request->all());

        return response()->json($friendRequest, 200);
    }

    // Delete a friend request
    public function destroy($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        $friendRequest->delete();

        return response()->json(['message' => 'Friend request deleted successfully'], 200);
    }
}
