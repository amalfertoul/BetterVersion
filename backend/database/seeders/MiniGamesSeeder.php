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
                'name' => 'The Watersons',
                'description' => 'Join Gumball and friends in this fun game.',
                'link' => '/storage/swf/watersons.swf',
                'image' => '/storage/swf/img/The_Watersons.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Super Smash Flash',
                'description' => 'Battle it out with your favorite characters.',
                'link' => '/storage/swf/SuperSmash.swf',
                'image' => '/storage/swf/img/SuperSmash.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Super Mario Flash 2',
                'description' => 'Relive Mario adventures in this fan-made game.',
                'link' => '/storage/swf/super-mario-flash-2.swf',
                'image' => '/storage/swf/img/super_mario_flash_2.webp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Angry Birds Chrome',
                'description' => 'Fling birds and destroy pig structures in this classic game.',
                'link' => '/storage/swf/angry-birds-chrome.swf',
                'image' => '/storage/swf/img/angry-birds-chrome.jfif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Angry Birds Halloween',
                'description' => 'Enjoy a spooky twist to Angry Birds.',
                'link' => '/storage/swf/angry-birds-halloween.swf',
                'image' => '/storage/swf/img/angry-birds-halloween.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bloons Tower Defense 4',
                'description' => 'Defend your tower with strategically placed monkeys!',
                'link' => '/storage/swf/Bloons_Tower_Defense_4.swf',
                'image' => '/storage/swf/img/Bloons_Tower_Defense_4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Breaking the Bank',
                'description' => 'Choose your way to break into the bank!',
                'link' => '/storage/swf/Breaking_the_Bank.swf',
                'image' => '/storage/swf/img/Breaking_the_Bank.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Duck Life 4',
                'description' => 'Train your duck to compete in races.',
                'link' => '/storage/swf/duck_life_4.swf',
                'image' => '/storage/swf/img/duck_life_4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Escaping the Prison',
                'description' => 'Use clever tools to escape the prison.',
                'link' => '/storage/swf/Escaping_the_Prison.swf',
                'image' => '/storage/swf/img/Escaping_the_Prison.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pac-Man',
                'description' => 'Eat pellets and avoid ghosts in this classic game.',
                'link' => '/storage/swf/pacman.swf',
                'image' => '/storage/swf/img/pacman.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Papas Freezeria',
                'description' => 'Manage your ice cream shop and satisfy customers.',
                'link' => '/storage/swf/Papas_Freezeria.swf',
                'image' => '/storage/swf/img/Papas_Freezeria.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plants vs. Zombies 2',
                'description' => 'Defend your home from zombie attacks using plants.',
                'link' => '/storage/swf/PvZ2.swf',
                'image' => '/storage/swf/img/PvZ2.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sonic the Hedgehog',
                'description' => 'Run and jump through levels with Sonic!',
                'link' => '/storage/swf/sonic_hedgehog.swf',
                'image' => '/storage/swf/img/sonic_the_hedgehog.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Space Invaders',
                'description' => 'Defend the planet by shooting down invading aliens.',
                'link' => '/storage/swf/space_invaders.swf',
                'image' => '/storage/swf/img/space_invaders.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Stealing the Diamond',
                'description' => 'Choose your path to steal the diamond.',
                'link' => '/storage/swf/Stealing_the_Diamond.swf',
                'image' => '/storage/swf/img/Stealing_the_Diamond.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tetris',
                'description' => 'A classic block puzzle game.',
                'link' => '/storage/swf/tetris.swf',
                'image' => '/storage/swf/img/tetris.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'The Impossible Quiz',
                'description' => 'A quiz game with absurd questions and answers.',
                'link' => '/storage/swf/The_Impossible_Quiz.swf',
                'image' => '/storage/swf/img/The_Impossible_Quiz.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
