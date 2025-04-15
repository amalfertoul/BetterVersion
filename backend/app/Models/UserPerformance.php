<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task; // Import the Task model

class UserPerformance extends Model
{
    use HasFactory;

    protected $table = 'user_performances';

    // Update the primary key to match the migration
    protected $primaryKey = 'id';

    // If the primary key is not an incrementing integer, set this to false
    public $incrementing = true;

    // Specify the key type
    protected $keyType = 'int';

    protected $fillable = [
        'score',
        'task_id',
        'timestamp',
    ];

    /**
     * Define the relationship with the Task model.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
