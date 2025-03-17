<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    /**
     * Afficher la liste des images.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $images = Image::all();
        return response()->json($images);;
    }

    /**
     * Créer une nouvelle image.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'category' => 'required|exists:categories,id', // Assurer que la catégorie existe
            'description' => 'required|string',
        ]);

        $image = Image::create([
            'url' => $request->url,
            'category_id' => $request->category,
            'description' => $request->description,
        ]);

        return response()->json($image, 201); // Retourner l'image créée
    }

    /**
     * Afficher une image spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $image = Image::findOrFail($id); // Trouver l'image par ID
        return response()->json($image);
    }

    /**
     * Mettre à jour une image existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $image = Image::findOrFail($id);

        $request->validate([
            'url' => 'string',
            'category' => 'exists:categories,id',
            'description' => 'string',
        ]);

        $image->update($request->only(['url', 'category', 'description']));

        return response()->json($image);
    }

    /**
     * Supprimer une image spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $image = Image::findOrFail($id);
        $image->delete();

        return response()->json(['message' => 'Image supprimée avec succès']);
    }
}
