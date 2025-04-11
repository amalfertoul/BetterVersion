<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPerformanceController;
use App\Http\Controllers\MiniGameController;
use App\Http\Controllers\FriendRequestController;


Route::apiResource('images', ImageController::class);

Route::apiResource('categories', CategoryController::class);

Route::apiResource('tasks', TaskController::class);

Route::apiResource('messages', MessageController::class);

Route::apiResource('users', UserController::class);

Route::apiResource('user-performance', UserPerformanceController::class);

Route::apiResource('mini-games', MiniGameController::class);

Route::apiResource('friend-requests', FriendRequestController::class);

//quotes routes should be added here please 
