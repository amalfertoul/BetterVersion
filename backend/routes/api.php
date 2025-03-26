<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ImageController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserPerformanceController;
use App\Http\Controllers\API\MiniGameController;
use App\Http\Controllers\API\FriendRequestController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::apiResource('images', ImageController::class);

// Routes pour le contrôleur Category
Route::apiResource('categories', CategoryController::class);

// Routes pour le contrôleur Task
Route::apiResource('tasks', TaskController::class);

// Routes pour le contrôleur Message
Route::apiResource('messages', MessageController::class);

// Routes pour le contrôleur User
Route::apiResource('users', UserController::class);

// Routes pour le contrôleur UserPerformance
Route::apiResource('user-performance', UserPerformanceController::class);

// Routes pour le contrôleur MiniGame
Route::apiResource('mini-games', MiniGameController::class);

// Routes pour le contrôleur FriendRequest
Route::apiResource('friend-requests', FriendRequestController::class);
