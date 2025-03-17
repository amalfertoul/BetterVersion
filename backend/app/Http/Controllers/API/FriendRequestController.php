<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FriendRequest;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(FriendRequest::all());  // Retourne toutes les demandes d'amis
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',  // Validation du statut de la demande
        ]);

        $friendRequest = FriendRequest::create($request->all());  // Crée une nouvelle demande d'ami

        return response()->json($friendRequest, 201);  // Retourne la demande d'ami créée
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $friendRequest = FriendRequest::findOrFail($id);  // Trouve une demande d'ami par son ID
        return response()->json($friendRequest);  // Retourne la demande d'ami
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',  // Validation du statut de la demande
        ]);

        $friendRequest = FriendRequest::findOrFail($id);  // Trouve la demande d'ami à mettre à jour
        $friendRequest->update($request->all());  // Met à jour la demande d'ami

        return response()->json($friendRequest);  // Retourne la demande d'ami mise à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        FriendRequest::destroy($id);  // Supprime la demande d'ami
        return response()->json(['message' => 'Friend request deleted successfully'], 204);  // Retourne un message de succès
    }
}
