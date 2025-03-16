<?php

namespace App\Http\Controllers;

use App\Models\MiniGame;
use Illuminate\Http\Request;

class MiniGameController extends Controller
{
    public function index()
    {
        return MiniGame::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'high_score' => 'required|integer',
        ]);

        return MiniGame::create($request->all());
    }

    public function show($id)
    {
        return MiniGame::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'high_score' => 'required|integer',
        ]);

        $game = MiniGame::findOrFail($id);
        $game->update($request->all());

        return $game;
    }

    public function destroy($id)
    {
        MiniGame::destroy($id);
        return response()->json(['message' => 'Mini game deleted successfully']);
    }
}
