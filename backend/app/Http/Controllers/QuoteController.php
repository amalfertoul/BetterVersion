<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote;

class QuoteController extends Controller
{
    /**
     * Display a listing of the quotes.
     */
    public function index()
    {
        $quotes = Quote::all();
        return response()->json($quotes);
    }

    /**
     * Store a newly created quote in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote_text' => 'required|string|max:255',
            'author_name' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:50',
        ]);

        $quote = Quote::create($validated);

        return response()->json([
            'message' => 'Quote created successfully!',
            'data' => $quote
        ], 201);
    }

    /**
     * Display the specified quote.
     */
    public function show($id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found!'], 404);
        }

        return response()->json($quote);
    }

    /**
     * Update the specified quote in storage.
     */
    public function update(Request $request, $id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found!'], 404);
        }

        $validated = $request->validate([
            'quote_text' => 'required|string|max:255',
            'author_name' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:50',
        ]);

        $quote->update($validated);

        return response()->json([
            'message' => 'Quote updated successfully!',
            'data' => $quote
        ]);
    }

    /**
     * Remove the specified quote from storage.
     */
    public function destroy($id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found!'], 404);
        }

        $quote->delete();

        return response()->json(['message' => 'Quote deleted successfully!']);
    }
}
