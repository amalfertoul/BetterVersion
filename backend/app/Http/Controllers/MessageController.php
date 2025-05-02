<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return Message::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'content' => 'required|string',
            'active_scope' => 'required|string',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $message = Message::create([
            'type' => $request->type,
            'content' => $request->content,
            'active_scope' => $request->active_scope,
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'timestamp' => now(),
        ]);

        return response()->json($message, 201);
    }

    public function show($id)
    {
        return Message::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string',
            'content' => 'required|string',
            'active_scope' => 'required|string',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $message = Message::findOrFail($id);
        $message->update([
            'type' => $request->type,
            'content' => $request->content,
            'active_scope' => $request->active_scope,
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
        ]);

        return response()->json($message);
    }

    public function destroy($id)
    {
        Message::destroy($id);
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
