<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/auth/signup', [AuthController::class, 'register']);
Route::post('/auth/signin', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('user', function(Request $r) {
        return response()->json($r->user());
    });
});

