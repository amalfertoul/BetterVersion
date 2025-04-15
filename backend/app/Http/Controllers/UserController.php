<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user();
    
        if (!$user || !$user->isAdmin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
    
        return response()->json(
            User::where('isAdmin', false)
                ->get([
                    'username',
                    'fullname',
                    'email',
                    'profile_picture',
                    'isAdmin',
                ])
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'fullname' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'profile_picture' => 'nullable|string',
            'password' => 'required|string',
            'isAdmin' => 'boolean',
        ]);

        $user = User::create([
            'username' => $request->username,
            'fullname' => $request->fullname,
            'email' => $request->email,
            'profile_picture' => $request->profile_picture,
            'password' => Hash::make($request->password),
            'isAdmin' => $request->isAdmin ?? false,
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'username' => $request->username ?? $user->username,
            'fullname' => $request->fullname ?? $user->fullname,
            'email' => $request->email ?? $user->email,
            'profile_picture' => $request->profile_picture ?? $user->profile_picture,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'isAdmin' => $request->isAdmin ?? $user->isAdmin,

        ]);


        return response()->json($user);

    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted']);
    }

    // public function uploadProfilePicture(Request $request)
    // {
    //     $request->validate([
    //         'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    //     ]);

    //     if ($request->hasFile('profile_picture')) {
    //         $file = $request->file('profile_picture');
    //         $path = $file->store('profile_pictures', 'public');

    //         // Save the path to the user's profile_picture field
    //         auth()->user()->update(['profile_picture' => $path]);

    //         return response()->json(['message' => 'Profile picture uploaded successfully', 'path' => $path]);
    //     }

    //     return response()->json(['message' => 'No profile picture uploaded'], 400);
    // }


    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $token = $user->createToken('Better Version')->plainTextToken;

    return response()->json([
        'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'fullname' => $user->fullname, 
            'email' => $user->email,
            'isAdmin' => $user->isAdmin,
        ],
        'token' => $token
    ]);
}

    public function logout(Request $request)
    {
    $user = auth()->user();

    if ($user) {
        $user->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    return response()->json(['message' => 'No user logged in'], 401);




    }


}



