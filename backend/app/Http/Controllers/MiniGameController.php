<?php

namespace App\Http\Controllers;

use App\Models\MiniGame;
use Illuminate\Http\Request;

class MiniGameController extends Controller
{
    // Afficher la liste des mini-jeux
    public function index()
    {
        return response()->json(MiniGame::all());
    }

    // Créer un nouveau mini-jeu
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|string',
            'image' => 'required|string',
        ]);

        $miniGame = MiniGame::create($validated);

        return response()->json($miniGame, 201);
    }

    // Afficher un mini-jeu spécifique
    public function show($id)
    {
        $miniGame = MiniGame::find($id);
        if (!$miniGame) {
            return response()->json(['message' => 'MiniGame not found'], 404);
        }
        return response()->json($miniGame);
    }

    // Mettre à jour un mini-jeu
    public function update(Request $request, $id)
    {
        $miniGame = MiniGame::find($id);
        if (!$miniGame) {
            return response()->json(['message' => 'MiniGame not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'link' => 'sometimes|required|string',
            'image' => 'sometimes|required|string',
        ]);

        $miniGame->update($validated);

        return response()->json($miniGame);
    }

    // Supprimer un mini-jeu
    public function destroy($id)
    {
        $miniGame = MiniGame::find($id);
        if (!$miniGame) {
            return response()->json(['message' => 'MiniGame not found'], 404);
        }
        $miniGame->delete();
        return response()->json(['message' => 'MiniGame deleted successfully']);
    }
}
