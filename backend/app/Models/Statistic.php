<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $primaryKey = 'statistic_id';

    protected $fillable = [
        'statistic_name',
        'statistic_category',
        'total_logins',
        'total_games',
        'total_quotes',
    ];
}

