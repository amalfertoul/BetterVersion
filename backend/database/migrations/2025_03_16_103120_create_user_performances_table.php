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
        Schema::create('user_performances', function (Blueprint $table) {
            $table->id('performance_id');
            $table->integer('score');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('game_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('game_id')->references('id')->on('mini_games')->onDelete('cascade');
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_performances');
    }
};
