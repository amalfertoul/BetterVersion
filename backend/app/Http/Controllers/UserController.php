<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'fullname' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'profile_picture' => 'nullable|string',
            'password' => 'required|string',
            'role' => 'required|in:user,admin',
        ]);

        $data = $request->all();
        $data['password'] = bcrypt($data['password']); // Hash the password

        return User::create($data);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username,' . $id . ',id',
            'fullname' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $id . ',id',
            'profile_picture' => 'nullable|string',
            'password' => 'nullable|string',
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);
        $data = $request->all();

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']); // Hash the password
        } else {
            unset($data['password']); // Do not update password if not provided
        }

        $user->update($data);

        return $user;
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $path = $file->store('profile_pictures', 'public');

            // Save the path to the user's profile_picture field
            auth()->user()->update(['profile_picture' => $path]);

            return response()->json(['message' => 'Profile picture uploaded successfully', 'path' => $path]);
        }

        return response()->json(['message' => 'No profile picture uploaded'], 400);
    }
}
