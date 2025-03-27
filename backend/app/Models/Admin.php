<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'admin_id';
    
    protected $fillable = [
        'login',
        'password',
        'email',
        'name',
    ];

    protected $hidden = [
        'password', 
        'remember_token',
    ];
}
