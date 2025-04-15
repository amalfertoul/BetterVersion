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
        ]);

        return MiniGame::create($request->all());
    }

    public function show($game_id)
    {
        return MiniGame::findOrFail($game_id);
    }

    public function update(Request $request, $game_id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $game = MiniGame::findOrFail($game_id);
        $game->update($request->all());

        return $game;
    }

    public function destroy($game_id)
    {
        MiniGame::destroy($game_id);
        return response()->json(['message' => 'Mini game deleted successfully']);
    }
}
