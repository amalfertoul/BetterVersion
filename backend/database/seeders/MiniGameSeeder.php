<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MiniGameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('mini_games')->insert([
            [
                'name' => 'Puzzle Mania',
                'description' => 'Assemble les pièces aussi vite que possible pour compléter le puzzle.',
                'high_score' => 1500,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Speed Typing',
                'description' => 'Tape le plus de mots en un temps limité pour battre le record.',
                'high_score' => 2500,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Memory Challenge',
                'description' => 'Mémorise et retrouve les paires le plus rapidement possible.',
                'high_score' => 1800,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
