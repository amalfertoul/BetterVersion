<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\VisionBoard;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $primaryKey = 'id'; // Update to match the migration

    protected $fillable = [
        'title',
        'status',
        'description',
        'user_id',
        'due_date',
    ];

    /**
     * Define the relationship with the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Define the hasMany relationship with the VisionBoard model.
     */
    public function visionBoards()
    {
        return $this->hasMany(VisionBoard::class, 'task_id', 'id'); // Ensure 'task_id' matches the foreign key in VisionBoard
    }
}
