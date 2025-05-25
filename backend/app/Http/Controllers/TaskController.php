<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        // Fetch all tasks with their associated user
        $tasks = Task::with('user')->get();
        return response()->json($tasks);

    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'title' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'due_date' => 'required|date',
        ]);

        // Create a new task
        $task = Task::create($request->all());

        return response()->json($task, 201);
    }

    public function show($id)
    {
        // Fetch a single task by its ID
        $task = Task::with('user')->findOrFail($id);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $request->validate([
            'title' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'due_date' => 'required|date',
        ]);

        // Find the task and update it
        $task = Task::findOrFail($id);
        $task->update($request->all());

        return response()->json($task);
    }

    public function getTasksByUserId($userId)
    {
        $tasks = Task::with('user')->where('user_id', $userId)->get();
        return response()->json($tasks);
    }

    public function destroy($id)
    {
        // Delete the task by its ID
        Task::destroy($id);

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
