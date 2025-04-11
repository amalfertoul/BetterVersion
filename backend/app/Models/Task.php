<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $primaryKey = 'task_id';

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

    //has many relationship with vision board
    public function visionBoards()
    {
        return $this->hasMany(VisionBoard::class, 'task_id', 'task_id');
    }
}
