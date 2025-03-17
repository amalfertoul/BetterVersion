<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MiniGame;
use Illuminate\Http\Request;

class MiniGameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(MiniGame::all());  // Retourne tous les mini-jeux
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',           // Validation du nom du mini-jeu
            'description' => 'required|string',    // Validation de la description
            'high_score' => 'required|integer',    // Validation du score élevé
        ]);

        $miniGame = MiniGame::create($request->all());  // Crée un nouveau mini-jeu

        return response()->json($miniGame, 201);  // Retourne le mini-jeu créé avec un code 201
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $miniGame = MiniGame::findOrFail($id);  // Trouve un mini-jeu par son ID
        return response()->json($miniGame);  // Retourne le mini-jeu
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',           // Validation du nom
            'description' => 'required|string',    // Validation de la description
            'high_score' => 'required|integer',    // Validation du score élevé
        ]);

        $miniGame = MiniGame::findOrFail($id);  // Trouve le mini-jeu à mettre à jour
        $miniGame->update($request->all());     // Met à jour les informations du mini-jeu

        return response()->json($miniGame);  // Retourne le mini-jeu mis à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        MiniGame::destroy($id);  // Supprime le mini-jeu
        return response()->json(['message' => 'Mini game deleted successfully'], 204);  // Retourne un message de succès
    }
}
