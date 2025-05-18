<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index()
    {
        return Image::with(['category'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|file|image|max:2048', // Validate the uploaded image
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);
    
        // Store the uploaded image
        $imagePath = $request->file('image')->store('images', 'public');
    
        $data = [
            'url' => $imagePath, // Save the image path as the URL
            'description' => $request->description,
            'user_id' => $request->user_id,
            'category_id' => $request->category_id,
        ];
    
        return Image::create($data);
    }

    public function show($id)
    {
        return Image::with(['category'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'url' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string', 
            'user_id' => 'required|exists:users,id', 
        ]);

        $image = Image::findOrFail($id);
        $data = $request->only(['url', 'description', 'user_id', 'category_id']);
        $image->update($data);

        return $image;
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
