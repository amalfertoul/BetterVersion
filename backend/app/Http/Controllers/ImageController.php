<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'image' => 'sometimes|file|image|max:2048', // Validate the uploaded image if provided
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $image = Image::findOrFail($id);

        // Handle file upload if a new image is provided
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($image->url) {
                Storage::disk('public')->delete($image->url);
            }

            // Store the new image
            $imagePath = $request->file('image')->store('images', 'public');
            $image->url = $imagePath;
        }

        // Update other fields
        $image->description = $request->description ?? $image->description;
        $image->category_id = $request->category_id ?? $image->category_id;
        $image->user_id = $request->user_id ?? $image->user_id;

        $image->save();

        return response()->json($image);
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
