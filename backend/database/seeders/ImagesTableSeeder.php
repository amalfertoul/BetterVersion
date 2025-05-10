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
                'url' => 'https://example.com/image1.jpg',
                'description' => 'A scenic mountain landscape.',
                'user_id' => 1,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/image2.jpg',
                'description' => 'A beautiful beach during sunset.',
                'user_id' => 2,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'url' => 'https://example.com/image3.jpg',
                'description' => 'Urban cityscape at night.',
                'user_id' => 1,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
