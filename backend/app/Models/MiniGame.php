<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MiniGame extends Model
{
    use HasFactory;

    protected $table = 'mini_games';

    // Update the primary key to match the migration
    protected $primaryKey = 'id';

    // Ensure the primary key is auto-incrementing and of type integer
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'description',
    ];
}
