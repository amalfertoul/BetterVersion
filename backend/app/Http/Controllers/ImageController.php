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
            'vision_board_id' => 'nullable|exists:vision_boards,id', // Optional vision board ID
        ]);
    
        // Store the uploaded image
        $imagePath = $request->file('image')->store('images', 'public');
    
        $data = [
            'url' => $imagePath, // Save the image path as the URL
            'description' => $request->description,
            'user_id' => $request->user_id,
            'category_id' => $request->category_id,
            'vision_board_id' => $request->vision_board_id, // Save the vision board ID if provided
        ];
    
        return Image::create($data);
    }

    public function show($id)
    {
        return Image::with(['category'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        \Log::info('Update request received:', $request->all());

        $request->validate([
            'image' => 'sometimes|file|image|max:2048',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'vision_board_id' => 'nullable|exists:vision_boards,id',
        ]);

        $image = Image::findOrFail($id);

        // Handle file upload if a new image is provided
        if ($request->hasFile('image')) {
            if ($image->url) {
                Storage::disk('public')->delete($image->url);
            }
            $imagePath = $request->file('image')->store('images', 'public');
            $image->url = $imagePath;
        }

        // Update other fields if present
        if ($request->has('description')) {
            $image->description = $request->description;
        }
        if ($request->has('category_id')) {
            $image->category_id = $request->category_id;
        }
        if ($request->has('user_id')) {
            $image->user_id = $request->user_id;
        }
        if ($request->has('vision_board_id')) {
            $image->vision_board_id = ($request->vision_board_id === '' || $request->vision_board_id === 'null')
                ? null
                : $request->vision_board_id;
        }

        $image->save();

        return response()->json($image);
    }

    /**
     * Assign an image to a vision board.
     */
    public function addToVisionBoard(Request $request, $id)
    {
        $request->validate([
            'vision_board_id' => 'required|exists:vision_boards,id',
        ]);

        $image = Image::findOrFail($id);
        $image->vision_board_id = $request->vision_board_id;
        $image->save();

        return response()->json([
            'message' => 'Image added to vision board successfully',
            'image' => $image
        ]);
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }


}