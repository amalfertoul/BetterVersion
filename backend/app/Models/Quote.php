<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'quote_text',
        'author_name',
        'category',
    ];

    /**
     * Additional configuration for the model (if needed).
     */
    // For example, if you need to customize the table name:
    // protected $table = 'quotes';
}
