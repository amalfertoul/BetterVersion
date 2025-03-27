<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'login' => 'required|unique:admins|max:255',
            'password' => 'required|min:8',
            'email' => 'required|email|unique:admins',
            'name' => 'nullable|string|max:255',
        ]);

        $admin = Admin::create([
            'login' => $validatedData['login'],
            'password' => Hash::make($validatedData['password']),
            'email' => $validatedData['email'],
            'name' => $validatedData['name'] ?? null,
        ]);

        return response()->json(['message' => 'Admin created successfully!', 'admin' => $admin], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $admin = Admin::findOrFail($id);
        return response()->json($admin);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        $validatedData = $request->validate([
            'login' => 'sometimes|required|unique:admins,login,' . $id . ',admin_id|max:255',
            'password' => 'sometimes|nullable|min:8',
            'email' => 'sometimes|required|email|unique:admins,email,' . $id . ',admin_id',
            'name' => 'nullable|string|max:255',
        ]);

        $admin->update([
            'login' => $validatedData['login'] ?? $admin->login,
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $admin->password,
            'email' => $validatedData['email'] ?? $admin->email,
            'name' => $validatedData['name'] ?? $admin->name,
        ]);

        return response()->json(['message' => 'Admin updated successfully!', 'admin' => $admin]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        return response()->json(['message' => 'Admin deleted successfully!']);
    }
}
