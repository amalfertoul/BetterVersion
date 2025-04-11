<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    protected $fillable = [
        'username',
        'fullname',
        'email',
        'profile_picture',
        'password',
        'role',
        'name'
    ];
    protected $table = 'users';

    protected $primaryKey = 'user_id';

    //has many relationship with tasks
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id', 'user_id');
    }

    //has many relationship with images
    public function images()
    {
        return $this->hasMany(Image::class, 'user_id', 'user_id');
    }
    
    //has many relationship with messages
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id', 'user_id');
    }

}
