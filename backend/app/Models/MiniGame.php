<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MiniGame extends Model
{
    use HasFactory;

    protected $table = 'mini_games';

    protected $primaryKey = 'game_id';

    protected $fillable = [
        'name',
        'description',
        'high_score',
    ];
}
