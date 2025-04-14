<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        return Category::create($request->all());
    }

    public function show($id)
    {
        return Category::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->all());

        return $category;
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
