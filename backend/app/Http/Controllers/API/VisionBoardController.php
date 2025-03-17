<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\VisionBoard;
use Illuminate\Http\Request;

class VisionBoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(VisionBoard::all());  // Retourne tous les tableaux de vision
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',         // Validation du nom
            'visibility' => 'required|boolean',   // Validation de la visibilité
        ]);

        $board = VisionBoard::create($request->all());  // Crée un nouveau tableau de vision

        return response()->json($board, 201);  // Retourne le tableau créé avec un code 201
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $board = VisionBoard::findOrFail($id);  // Trouve le tableau de vision par son ID
        return response()->json($board);  // Retourne le tableau trouvé
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',         // Validation du nom
            'visibility' => 'required|boolean',   // Validation de la visibilité
        ]);

        $board = VisionBoard::findOrFail($id);  // Trouve le tableau de vision à mettre à jour
        $board->update($request->all());        // Met à jour les informations du tableau

        return response()->json($board);  // Retourne le tableau de vision mis à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        VisionBoard::destroy($id);  // Supprime le tableau de vision par son ID
        return response()->json(['message' => 'Vision board deleted successfully'], 204);  // Message de succès
    }
}
