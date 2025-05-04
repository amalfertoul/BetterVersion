<?php

namespace App\Http\Controllers;

use App\Models\MiniGame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MiniGameController extends Controller
{
    public function index()
    {
        return MiniGame::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'link' => 'required|file|mimes:swf|max:2048', // SWF file validation
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Image validation
        ]);

        // Handle SWF file upload
        $swfPath = $request->file('link')->store('swf', 'public');
        
        // Handle image upload
        $imagePath = $request->file('image')->store('images', 'public');

        $game = MiniGame::create([
            'name' => $request->name,
            'description' => $request->description,
            'link' => asset('storage/' . $swfPath), // Link to the SWF file
            'image' => asset('storage/' . $imagePath), // Link to the image
        ]);

        return response()->json($game, 201);
    }

    public function show($game_id)
    {
        return MiniGame::findOrFail($game_id);
    }

    public function update(Request $request, $game_id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'link' => 'nullable|file|mimes:swf|max:2048', // SWF file validation
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Image validation
        ]);

        $game = MiniGame::findOrFail($game_id);

        // Handle SWF file update if a new file is provided
        if ($request->hasFile('link')) {
            // Delete the old SWF file
            $swfPath = $game->link;
            if ($swfPath) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $swfPath));
            }

            // Store new SWF file
            $newSwfPath = $request->file('link')->store('swf', 'public');
            $game->link = asset('storage/' . $newSwfPath);
        }

        // Handle image update if a new image is provided
        if ($request->hasFile('image')) {
            // Delete the old image
            if ($game->image) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $game->image));
            }

            // Store new image
            $newImagePath = $request->file('image')->store('images', 'public');
            $game->image = asset('storage/' . $newImagePath);
        }

        $game->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return $game;
    }

    public function destroy($game_id)
    {
        $game = MiniGame::findOrFail($game_id);

        // Delete the SWF file
        if ($game->link) {
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $game->link));
        }

        // Delete the image file
        if ($game->image) {
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $game->image));
        }

        $game->delete();

        return response()->json(['message' => 'Mini game deleted successfully']);
    }
}
