<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id('statistic_id');
            $table->string('statistic_name');
            $table->string('statistic_category');
            $table->integer('total_logins')->default(0);
            $table->integer('total_games')->default(0);
            $table->integer('total_quotes')->default(0);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('quotes_id');
            $table->unsignedBigInteger('task_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('quotes_id')->references('id')->on('quotes')->onDelete('cascade');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('statistics');
    }
}
