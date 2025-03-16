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
    ];
}
