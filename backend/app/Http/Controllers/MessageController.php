<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        ]);

        return Message::create($request->all());
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
        ]);

        $message = Message::findOrFail($id);
        $message->update($request->all());

        return $message;
    }

    public function destroy($id)
    {
        Message::destroy($id);
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
