<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPerformance extends Model
{
    use HasFactory;

    protected $table = 'user_performances';

    protected $primaryKey = 'performance_id';

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
