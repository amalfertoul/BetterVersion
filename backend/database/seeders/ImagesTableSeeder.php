<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('images')->insert([
            [
                'url' => 'https://images.unsplash.com/photo-1601758123927-196c7b3bdf57
',
                'description' => 'A scenic mountain landscape.',
                'user_id' => 1,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475
',
                'description' => 'A beautiful beach during sunset.',
                'user_id' => 2,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1494526585095-c41746248156
',
                'description' => 'Urban cityscape at night.',
                'user_id' => 1,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}