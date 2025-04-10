<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisionBoard extends Model
{
    use HasFactory;

    protected $table = 'vision_boards';

    protected $primaryKey = 'board_id';

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
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    // has many relationship with tasks
    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_id', 'task_id');
    }
}
