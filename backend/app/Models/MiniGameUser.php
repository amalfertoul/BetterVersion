<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\MiniGame;
use App\Models\User;

class MiniGameUser extends Model
{
    protected $table = 'mini_game_user';

    protected $fillable = [
        'mini_game_id',
        'user_id',
        'date',
    ];

    /**
     * Get the mini game associated with this record.
     */
    public function miniGame(): BelongsTo
    {
        return $this->belongsTo(MiniGame::class, 'mini_game_id');
    }

    /**
     * Get the user associated with this record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
