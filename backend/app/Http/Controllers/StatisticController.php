<?php

namespace App\Http\Controllers;

use App\Models\Statistic;
use Illuminate\Http\Request;

class StatisticController extends Controller
{
    public function index()
    {
        return Statistic::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'statistic_name' => 'required|string|max:255',
            'statistic_category' => 'required|string|max:255',
            'total_logins' => 'integer|min:0',
            'total_games' => 'integer|min:0',
            'total_quotes' => 'integer|min:0',
        ]);

        return Statistic::create($data);
    }

    public function show($id)
    {
        return Statistic::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'statistic_name' => 'string|max:255',
            'statistic_category' => 'string|max:255',
            'total_logins' => 'integer|min:0',
            'total_games' => 'integer|min:0',
            'total_quotes' => 'integer|min:0',
        ]);

        $statistic = Statistic::findOrFail($id);
        $statistic->update($data);

        return $statistic;
    }

    public function destroy($id)
    {
        $statistic = Statistic::findOrFail($id);
        $statistic->delete();

        return response()->json(['message' => 'Statistic deleted successfully.']);
    }
}

