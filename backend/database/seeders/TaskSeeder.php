<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tasks')->insert([
            [
                'title' => 'Finaliser le rapport',
                'status' => 'pending',
                'description' => 'Rédiger et envoyer le rapport final au client.',
                'due_date' => Carbon::now()->addDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Développement de la fonctionnalité X',
                'status' => 'in_progress',
                'description' => 'Travailler sur la nouvelle fonctionnalité du projet.',
                'due_date' => Carbon::now()->addWeek(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Réunion avec l\'équipe',
                'status' => 'completed',
                'description' => 'Discuter des prochaines étapes du projet.',
                'due_date' => Carbon::now()->subDay(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tester l\'application',
                'status' => 'pending',
                'description' => 'Effectuer une série de tests avant le déploiement.',
                'due_date' => Carbon::now()->addDays(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
