<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index()
    {
        return Image::with('category')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'category_id' => 'required|exists:categories,category_id',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['url', 'description', 'user_id', 'category_id']);
        return Image::create($data);
    }

    public function show($id)
    {
        return Image::with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'url' => 'required|string',
            'category' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['url', 'description', 'user_id', 'category_id']);
        $image->update($data);
        $image->update($request->all());

        return $image;
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
