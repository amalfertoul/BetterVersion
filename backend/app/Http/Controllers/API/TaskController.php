<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Récupérer toutes les tâches
        return response()->json(Task::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        // Créer une nouvelle tâche
        $task = Task::create([
            'title' => $request->title,
            'status' => $request->status,
            'description' => $request->description,
            'due_date' => $request->due_date,
        ]);

        return response()->json($task, 201);  // Retourne la tâche créée avec un code 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Trouver la tâche par son ID
        $task = Task::find($id);

        if ($task) {
            return response()->json($task);
        } else {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Trouver la tâche à mettre à jour
        $task = Task::find($id);

        if ($task) {
            // Validation des données envoyées
            $request->validate([
                'title' => 'string|max:255',
                'status' => 'in:pending,in_progress,completed',
                'description' => 'string',
                'due_date' => 'date',
            ]);

            // Mettre à jour la tâche
            $task->update([
                'title' => $request->title ?? $task->title,
                'status' => $request->status ?? $task->status,
                'description' => $request->description ?? $task->description,
                'due_date' => $request->due_date ?? $task->due_date,
            ]);

            return response()->json($task);
        } else {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Trouver la tâche à supprimer
        $task = Task::find($id);

        if ($task) {
            $task->delete();
            return response()->json(null, 204);  // Retourne une réponse vide avec code 204
        } else {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }
}
