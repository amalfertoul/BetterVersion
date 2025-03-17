<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;  // Assure-toi que le modèle Message est créé
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Récupérer tous les messages
        return response()->json(Message::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'sender' => 'required|string|max:255',
            'receiver' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Créer un nouveau message
        $message = Message::create([
            'sender' => $request->sender,
            'receiver' => $request->receiver,
            'message' => $request->message,
        ]);

        return response()->json($message, 201);  // Retourne le message créé avec code 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Trouver le message par son ID
        $message = Message::find($id);

        if ($message) {
            return response()->json($message);
        } else {
            return response()->json(['error' => 'Message not found'], 404);  // Si le message n'existe pas
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Trouver le message à mettre à jour
        $message = Message::find($id);

        if ($message) {
            // Validation des données envoyées
            $request->validate([
                'message' => 'required|string',
            ]);

            // Mettre à jour le message
            $message->update([
                'message' => $request->message,
            ]);

            return response()->json($message);
        } else {
            return response()->json(['error' => 'Message not found'], 404);  // Si le message n'existe pas
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Trouver le message à supprimer
        $message = Message::find($id);

        if ($message) {
            $message->delete();
            return response()->json(null, 204);  // Retourne une réponse vide avec le code 204
        } else {
            return response()->json(['error' => 'Message not found'], 404);  // Si le message n'existe pas
        }
    }
}
