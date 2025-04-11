<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $table = 'images';

    protected $primaryKey = 'image_id';

    protected $fillable = [
        'url',
        'description',
        'user_id',
        'category_id',
    ];

    /**
     * Get the user that owns the image.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the image belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
