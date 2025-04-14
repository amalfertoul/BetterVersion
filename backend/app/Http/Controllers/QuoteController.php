<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    // Display a listing of the quotes
    public function index()
    {
        $quotes = Quote::all();
        return response()->json($quotes);
    }

    // Store a newly created quote in storage
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'quote_text' => 'required|string',
            'author_name' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $quote = Quote::create($validatedData);
        return response()->json($quote, 201);
    }

    // Display the specified quote
    public function show($id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found'], 404);
        }

        return response()->json($quote);
    }

    // Update the specified quote in storage
    public function update(Request $request, $id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found'], 404);
        }

        $validatedData = $request->validate([
            'quote_text' => 'required|string',
            'author_name' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $quote->update($validatedData);
        return response()->json($quote);
    }

    // Remove the specified quote from storage
    public function destroy($id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found'], 404);
        }

        $quote->delete();
        return response()->json(['message' => 'Quote deleted successfully']);
    }
}
