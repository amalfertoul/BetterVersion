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
            'category' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        return Image::create($request->all());
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

        $image = Image::findOrFail($id);
        $image->update($request->all());

        return $image;
    }

    public function destroy($id)
    {
        Image::destroy($id);
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
