<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FriendRequest extends Model
{
    use HasFactory;

    protected $table = 'friend_requests';

    protected $primaryKey = 'request_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'status',
        'sender_id',
        'receiver_id',
    ];

    /**
     * Get the sender of the friend request.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the receiver of the friend request.
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
