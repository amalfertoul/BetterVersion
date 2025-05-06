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
                'name' => 'Bloons Tower Defense 4',
                'description' => 'Defend your tower with strategically placed monkeys!',
                'link' => '/storage/swf/BloonsTowerDefense4.swf',
                'image' => '/storage/images/bloons-tower-defense-4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Breaking the Bank',
                'description' => 'Choose your way to break into the bank!',
                'link' => '/storage/swf/BreakingTheBank.swf',
                'image' => '/storage/images/breaking-the-bank.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Escaping the Prison',
                'description' => 'Use clever tools to escape the prison.',
                'link' => '/storage/swf/EscapingThePrison.swf',
                'image' => '/storage/images/escaping-the-prison.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Papas Freezeria',
                'description' => 'Manage your ice cream shop and satisfy customers.',
                'link' => '/storage/swf/PapasFreezeria.swf',
                'image' => '/storage/images/papas-freezeria.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Stealing the Diamond',
                'description' => 'Choose your path to steal the diamond.',
                'link' => '/storage/swf/StealingTheDiamond.swf',
                'image' => '/storage/images/stealing-the-diamond.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'The Impossible Quiz',
                'description' => 'A quiz game with absurd questions and answers.',
                'link' => '/storage/swf/TheImpossibleQuiz.swf',
                'image' => '/storage/images/the-impossible-quiz.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Duck Life 4',
                'description' => 'Train your duck to compete in races.',
                'link' => '/storage/swf/duck-life-4.swf',
                'image' => '/storage/images/duck-life-4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pac-Man',
                'description' => 'Eat pellets and avoid ghosts in this classic game.',
                'link' => '/storage/swf/pacman.swf',
                'image' => '/storage/images/pacman.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sonic the Hedgehog',
                'description' => 'Run and jump through levels with Sonic!',
                'link' => '/storage/swf/sonichedgehog.swf',
                'image' => '/storage/images/sonic-the-hedgehog.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Space Invaders',
                'description' => 'Defend the planet by shooting down invading aliens.',
                'link' => '/storage/swf/spaceinvaders.swf',
                'image' => '/storage/images/space-invaders.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tetris',
                'description' => 'A classic block puzzle game.',
                'link' => '/storage/swf/tetris.swf',
                'image' => '/storage/images/tetris.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
