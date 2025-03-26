<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('images')->insert([
            [
                'url' => 'https://example.com/images/tech1.jpg',
                'category' => 1, // ID d'une catégorie existante
                'description' => 'Une image de la dernière technologie.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/images/science1.jpg',
                'category' => 2,
                'description' => 'Un aperçu des découvertes scientifiques récentes.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/images/art1.jpg',
                'category' => 3,
                'description' => 'Une peinture abstraite moderne.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/images/music1.jpg',
                'category' => 4,
                'description' => 'Une image d\'un concert en direct.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/images/sport1.jpg',
                'category' => 5,
                'description' => 'Un joueur marquant un but impressionnant.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
