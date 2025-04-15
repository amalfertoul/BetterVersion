<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Task;

class VisionBoard extends Model
{
    use HasFactory;

    protected $table = 'vision_boards';

    protected $primaryKey = 'id'; // Matches the primary key in the migration

    protected $fillable = [
        'name',
        'visibility',
        'user_id',
        'task_id',
    ];

    /**
     * Get the user that owns the vision board.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get the task associated with the vision board.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'id');
    }

    /**
     * Get all tasks associated with the vision board.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'id', 'task_id'); // Adjusted to match the foreign key relationship
    }
}
