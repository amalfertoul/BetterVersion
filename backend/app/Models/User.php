<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Task;
use App\Models\Image;
use App\Models\Message;
use App\Models\MiniGameUser;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'username',
        'fullname',
        'email',
        'profile_picture',
        'password',
        'isAdmin',
    ];

    protected $table = 'users';

    protected $primaryKey = 'id';

    // has many relationship with tasks
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id', 'id');
    }

    // has many relationship with images
    public function images()
    {
        return $this->hasMany(Image::class, 'user_id', 'id');
    }

    // has many relationship with messages
    public function messages()
    {
        return $this->hasMany(Message::class, 'user_id', 'id');
    }

    // has many relationship with miniGame users
    public function miniGameUsers()
    {
        return $this->hasMany(MiniGameUser::class, 'user_id', 'id');
    }
}
