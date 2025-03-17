<?php
namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ImageController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserPerformanceController;
use App\Http\Controllers\API\MiniGameController;
use App\Http\Controllers\API\FriendRequestController;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('images', ImageController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('messages', MessageController::class);

