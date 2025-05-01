<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index()
    {
        return Image::with(['category', 'visionBoard'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'vision_board_id' => 'nullable|exists:vision_boards,id',
        ]);

        $data = $request->only(['url', 'description', 'user_id', 'category_id', 'vision_board_id']);
        return Image::create($data);
    }

    public function show($id)
    {
        return Image::with(['category', 'visionBoard'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'url' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'vision_board_id' => 'nullable|exists:vision_boards,id',
        ]);

        $image = Image::findOrFail($id);
        $data = $request->only(['url', 'description', 'user_id', 'category_id', 'vision_board_id']);
        $image->update($data);

        return $image;
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
