<?php

namespace App\Http\Controllers;

use App\Models\MiniGame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'link' => 'required|url',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Gérer le téléchargement de l'image
        $imagePath = $request->file('image')->store('images', 'public');

        $game = MiniGame::create([
            'name' => $request->name,
            'description' => $request->description,
            'link' => $request->link,
            'image' => $imagePath,
        ]);

        return response()->json($game, 201);
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
            'link' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $game = MiniGame::findOrFail($game_id);

        // Gérer la mise à jour de l'image si une nouvelle image est fournie
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($game->image) {
                Storage::disk('public')->delete($game->image);
            }

            // Télécharger la nouvelle image
            $imagePath = $request->file('image')->store('images', 'public');
            $game->image = $imagePath;
        }

        $game->update([
            'name' => $request->name,
            'description' => $request->description,
            'link' => $request->link,
        ]);

        return $game;
    }

    public function destroy($game_id)
    {
        $game = MiniGame::findOrFail($game_id);

        // Supprimer l'image associée
        if ($game->image) {
            Storage::disk('public')->delete($game->image);
        }

        $game->delete();

        return response()->json(['message' => 'Mini game deleted successfully']);
    }
}
