<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserPerformance;
use Illuminate\Http\Request;

class UserPerformanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(UserPerformance::all());  // Retourne toutes les performances des utilisateurs
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',         // Validation du score
            'timestamp' => 'required|date',        // Validation du timestamp
        ]);

        $performance = UserPerformance::create($request->all());  // Crée une nouvelle performance d'utilisateur

        return response()->json($performance, 201);  // Retourne la performance créée avec un code 201
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $performance = UserPerformance::findOrFail($id);  // Trouve la performance par son ID
        return response()->json($performance);  // Retourne la performance de l'utilisateur
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'score' => 'required|integer',         // Validation du score
            'timestamp' => 'required|date',        // Validation du timestamp
        ]);

        $performance = UserPerformance::findOrFail($id);  // Trouve la performance à mettre à jour
        $performance->update($request->all());           // Met à jour la performance de l'utilisateur

        return response()->json($performance);  // Retourne la performance mise à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        UserPerformance::destroy($id);  // Supprime la performance d'un utilisateur
        return response()->json(['message' => 'Performance record deleted successfully'], 204);  // Message de succès
    }
}
