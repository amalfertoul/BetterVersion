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
        'timestamp',
    ];
}
