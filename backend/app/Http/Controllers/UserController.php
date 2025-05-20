<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::where('isAdmin', false)
                ->get([
                    'id',
                    'username',
                    'fullname',
                    'email',
                    'profile_picture',
                    'isAdmin',
                ])->map(function ($user) {
                    $user->profile_picture_url = $user->profile_picture 
                        ? Storage::url($user->profile_picture) 
                        : null;
                    return $user;
                })
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'fullname' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'profile_picture' => 'nullable|file|image|max:2048',
            'password' => 'required|string',
            'isAdmin' => 'boolean',
        ]);

        $profilePicturePath = $request->file('profile_picture') 
            ? $request->file('profile_picture')->store('pfe', 'public') 
            : 'pfp/defaultpfp.jpg'; // Default profile picture

        $user = User::create([
            'username' => $request->username,
            'fullname' => $request->fullname,
            'email' => $request->email,
            'profile_picture' => $profilePicturePath,
            'password' => Hash::make($request->password),
            'isAdmin' => $request->isAdmin ?? false,
        ]);

        $user->profile_picture_url = $profilePicturePath 
            ? Storage::url($profilePicturePath) 
            : null;

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        $user->profile_picture_url = $user->profile_picture 
            ? Storage::url($user->profile_picture) 
            : null;
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'fullname' => 'sometimes|string',
            'email' => 'sometimes|string|email|unique:users,email,' . $id,
            'profile_picture' => 'nullable|file|image|max:2048',
            'password' => 'sometimes|string',
            'isAdmin' => 'boolean',
        ]);

        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $user->profile_picture = $request->file('profile_picture')->store('pfe', 'public');
        }

        $user->update([
            'username' => $request->username ?? $user->username,
            'fullname' => $request->fullname ?? $user->fullname,
            'email' => $request->email ?? $user->email,
            'profile_picture' => $user->profile_picture,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'isAdmin' => $request->isAdmin ?? $user->isAdmin,
        ]);

        $user->profile_picture_url = $user->profile_picture 
            ? Storage::url($user->profile_picture) 
            : null;

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        $user = User::where('username', $request->username)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $user->profile_picture_url = $user->profile_picture 
            ? Storage::url($user->profile_picture) 
            : null;
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'profile_picture_url' => $user->profile_picture_url,
                'isAdmin' => $user->isAdmin,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }    
    

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    
        return response()->json(['message' => 'Logged out successfully']);
    }
    
}
