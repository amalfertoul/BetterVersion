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
use App\Http\Controllers\VisionBoardController;
use App\Http\Controllers\MiniGameUserController;

// Public routes
Route::post('login', [UserController::class, 'login'])->name('login'); // Explicitly name the login route
Route::post('register', [UserController::class, 'store']); // Optional: for user registration

// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
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
    Route::apiResource('visionboards', VisionBoardController::class);
    Route::apiResource('mini-game-users', MiniGameUserController::class);

    Route::post('/users/{id}/update-profile-picture', [UserController::class, 'updateProfilePicture']);

    
    // Vision Boards Routes
    Route::prefix('vision-boards')->group(function () {
        Route::get('/', [VisionBoardController::class, 'index']);
        Route::post('/', [VisionBoardController::class, 'store']);
        Route::get('/{id}', [VisionBoardController::class, 'show']);
        Route::put('/{id}', [VisionBoardController::class, 'update']);
        Route::delete('/{id}', [VisionBoardController::class, 'destroy']);
    });

    // Get authenticated user details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
