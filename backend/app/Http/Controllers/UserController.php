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
            'name' => 'required|string',
            'profile_picture' => 'nullable|string',
            'password' => 'required|string',
        ]);

        return User::create($request->all());
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'profile_picture' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $user = User::findOrFail($id);
        $user->update($request->all());

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
        }

    return redirect()->back()->with('success', 'Profile picture uploaded successfully.');
}
}

