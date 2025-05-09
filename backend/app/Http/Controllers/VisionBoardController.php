<?php

namespace App\Http\Controllers;

use App\Models\VisionBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VisionBoardController extends Controller
{
    public function index()
    {
        $visionBoards = VisionBoard::all();
        return response()->json($visionBoards);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'visibility' => 'required|boolean',
                'user_id' => 'required|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Convert string 'true'/'false' to boolean if needed
            $data = $request->all();
            if (is_string($data['visibility'])) {
                $data['visibility'] = $data['visibility'] === 'true';
            }

            $visionBoard = VisionBoard::create($data);

            return response()->json($visionBoard, 201);
        } catch (\Exception $e) {
            \Log::error('Vision Board Creation Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create vision board',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $visionBoard = VisionBoard::findOrFail($id);
        return response()->json($visionBoard);
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'visibility' => 'sometimes|required|boolean',
                'user_id' => 'sometimes|required|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $visionBoard = VisionBoard::findOrFail($id);
            $data = $request->all();
            
            // Convert string 'true'/'false' to boolean if needed
            if (isset($data['visibility']) && is_string($data['visibility'])) {
                $data['visibility'] = $data['visibility'] === 'true';
            }

            $visionBoard->update($data);

            return response()->json($visionBoard);
        } catch (\Exception $e) {
            \Log::error('Vision Board Update Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update vision board',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $visionBoard = VisionBoard::findOrFail($id);
            $visionBoard->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            \Log::error('Vision Board Deletion Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete vision board',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
