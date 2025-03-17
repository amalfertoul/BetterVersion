<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::all());  // Retourne tous les utilisateurs
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'profile_picture' => 'nullable|string',
            'password' => 'required|string',
        ]);

        // Créer un nouvel utilisateur
        $user = User::create([
            'name' => $request->name,
            'profile_picture' => $request->profile_picture,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($user, 201);  // Retourne l'utilisateur créé
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);  // Retourne un utilisateur spécifique
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'profile_picture' => 'nullable|string',
            'password' => 'nullable|string',  // Le mot de passe est facultatif lors de la mise à jour
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'profile_picture' => $request->profile_picture,
            'password' => $request->password ? bcrypt($request->password) : $user->password,  // Met à jour seulement si un mot de passe est fourni
        ]);

        return response()->json($user);  // Retourne l'utilisateur mis à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 204);  // Retourne un message de succès
    }

    /**
     * Upload the user's profile picture.
     */
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',  // Validation du fichier image
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $path = $file->store('profile_pictures', 'public');  // Sauvegarde de l'image dans le dossier public

            // Mise à jour du chemin de l'image dans la base de données
            auth()->user()->update(['profile_picture' => $path]);

            return response()->json(['message' => 'Profile picture uploaded successfully', 'path' => $path]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);  // Si aucun fichier n'est uploadé
    }
}
