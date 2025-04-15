<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mini_game_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mini_game_id');
            $table->unsignedBigInteger('user_id');
            $table->date('date');
            $table->timestamps();

            $table->foreign('mini_game_id')->references('id')->on('mini_games')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mini_game_user');
    }
};
