<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('messages')->insert([
            [
                'type' => 'info',
                'content' => 'Bienvenue sur notre plateforme !',
                'active_scope' => 'global',
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'warning',
                'content' => 'Maintenance prévue ce dimanche à 22h.',
                'active_scope' => 'global',
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'error',
                'content' => 'Une erreur s\'est produite lors de votre dernière action.',
                'active_scope' => 'user',
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
