<?php

namespace App\Http\Controllers;

use App\Models\UserPerformance;
use Illuminate\Http\Request;

class UserPerformanceController extends Controller
{
    public function index()
    {
        return UserPerformance::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:mini_games,id',
            'timestamp' => 'required|date',
        ]);

        return UserPerformance::create($request->all());
    }

    public function show($id)
    {
        return UserPerformance::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'score' => 'required|integer',
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:mini_games,id',
            'timestamp' => 'required|date',
        ]);

        $performance = UserPerformance::findOrFail($id);
        $performance->update($request->all());

        return $performance;
    }

    public function destroy($id)
    {
        UserPerformance::destroy($id);
        return response()->json(['message' => 'Performance record deleted successfully']);
    }
}
