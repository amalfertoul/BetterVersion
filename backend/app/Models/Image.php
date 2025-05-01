<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;

class Image extends Model
{
    use HasFactory;

    protected $table = 'images';

    // Update the primary key to match the migration
    protected $primaryKey = 'id';

    // Remove $primaryKey if you're using the default 'id'

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
    /**
     * Get the vision board that the image belongs to.
     */
    public function visionBoard()
    {
        return $this->belongsToMany(VisionBoard::class, 'vision_board_id', 'id');
    }
}
