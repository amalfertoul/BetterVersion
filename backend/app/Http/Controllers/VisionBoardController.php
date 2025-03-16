<?php

namespace App\Http\Controllers;

use App\Models\VisionBoard;
use Illuminate\Http\Request;

class VisionBoardController extends Controller
{
    public function index()
    {
        return VisionBoard::all();;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'visibility' => 'required|boolean',
        ]);

        return VisionBoard::create($request->all());
    }

    public function show($id)
    {
        return VisionBoard::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'visibility' => 'required|boolean',
        ]);

        $board = VisionBoard::findOrFail($id);
        $board->update($request->all());

        return $board;
    }

    public function destroy($id)
    {
        VisionBoard::destroy($id);
        return response()->json(['message' => 'Vision board deleted successfully']);
    }
}
