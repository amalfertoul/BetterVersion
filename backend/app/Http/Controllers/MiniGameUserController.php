<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MiniGameUser;
use Illuminate\Http\JsonResponse;

class MiniGameUserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $miniGameUsers = MiniGameUser::all();
        return response()->json($miniGameUsers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'mini_game_id' => 'required|exists:mini_games,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $miniGameUser = MiniGameUser::create($validatedData);
        return response()->json($miniGameUser, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $miniGameUser = MiniGameUser::findOrFail($id);
        return response()->json($miniGameUser);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $miniGameUser = MiniGameUser::findOrFail($id);

        $validatedData = $request->validate([
            'mini_game_id' => 'sometimes|exists:mini_games,id',
            'user_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
        ]);

        $miniGameUser->update($validatedData);
        return response()->json($miniGameUser);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $miniGameUser = MiniGameUser::findOrFail($id);
        $miniGameUser->delete();

        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
