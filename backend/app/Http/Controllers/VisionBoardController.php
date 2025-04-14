<?php

namespace App\Http\Controllers;

use App\Models\VisionBoard;
use Illuminate\Http\Request;

class VisionBoardController extends Controller
{
    public function index()
    {
        return VisionBoard::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'visibility' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'nullable|exists:tasks,task_id',
        ]);

        $visionBoard = VisionBoard::create($request->only(['name', 'visibility', 'user_id', 'task_id']));

        return response()->json($visionBoard, 201);
    }

    public function show($id)
    {
        return VisionBoard::where('board_id', $id)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'visibility' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'nullable|exists:tasks,task_id',
        ]);

        $board = VisionBoard::where('board_id', $id)->firstOrFail();
        $board->update($request->only(['name', 'visibility', 'user_id', 'task_id']));

        return response()->json($board);
    }

    public function destroy($id)
    {
        $board = VisionBoard::where('board_id', $id)->firstOrFail();
        $board->delete();

        return response()->json(['message' => 'Vision board deleted successfully']);
    }
}
