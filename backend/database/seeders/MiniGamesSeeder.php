<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MiniGamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('mini_games')->insert([
            [
                'name' => 'Tetris',
                'description' => 'Un jeu classique de puzzle où vous empilez des blocs.',
                'link' => 'https://tetris.com/play-tetris', // Lien direct vers Tetris
                'image' => 'https://example.com/images/tetris.jpg', // Image pour Tetris
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pac-Man',
                'description' => 'Mangez des pac-gommes tout en évitant les fantômes.',
                'link' => 'https://www.google.com/doodles/30th-anniversary-of-pac-man', // Lien direct vers Pac-Man
                'image' => 'https://example.com/images/pacman.jpg', // Image pour Pac-Man
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Snake',
                'description' => 'Contrôlez un serpent qui grandit en mangeant des fruits.',
                'link' => 'https://playsnake.org/', // Lien direct vers Snake
                'image' => 'https://example.com/images/snake.jpg', // Image pour Snake
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2048',
                'description' => 'Combinez les tuiles pour atteindre le nombre 2048.',
                'link' => 'https://play2048.co/', // Lien direct vers 2048
                'image' => 'https://example.com/images/2048.jpg', // Image pour 2048
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Flappy Bird',
                'description' => 'Faites voler un oiseau en évitant les obstacles.',
                'link' => 'https://flappybird.io/', // Lien direct vers Flappy Bird
                'image' => 'https://example.com/images/flappybird.jpg', // Image pour Flappy Bird
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
  
