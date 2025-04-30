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
use App\Http\Controllers\QuoteController;


// Route::middleware('auth:sanctum')->group(function () {   
// });

Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'store']);
Route::post('logout', [UserController::class, 'logout']);
Route::apiResource('users', UserController::class);
Route::apiResource('images', ImageController::class);
Route::apiResource('quotes', QuoteController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('messages', MessageController::class);
Route::apiResource('user-performance', UserPerformanceController::class);
Route::apiResource('mini-games', MiniGameController::class);
Route::apiResource('friend-requests', FriendRequestController::class);