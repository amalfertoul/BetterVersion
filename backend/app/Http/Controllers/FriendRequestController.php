<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    public function index()
    {
        return FriendRequest::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        return FriendRequest::create($request->all());
    }

    public function show($id)
    {
        return FriendRequest::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        $friendRequest = FriendRequest::findOrFail($id);
        $friendRequest->update($request->all());

        return $friendRequest;
    }

    public function destroy($id)
    {
        FriendRequest::destroy($id);
        return response()->json(['message' => 'Friend request deleted successfully']);
    }
}
